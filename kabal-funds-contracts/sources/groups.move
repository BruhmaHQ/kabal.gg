/// This module implements a Investment Group functionality that allows admins to act as fund managerrs
/// between different asset types using the Anqa router for swaps.
module bagz::groups {
    use std::signer;
    use std::string::String;

    use supra_framework::coin::{Self, Coin};
    use supra_framework::event::{Self};
    use supra_framework::timestamp;
    use supra_framework::object;

    use aptos_std::type_info;
    use aptos_std::table::{Self, Table};

    // use anqa::router;

    // -----------------------------------------
    // -------------- Error codes --------------
    // -----------------------------------------

    /// Order amount must be greater than zero
    const EINVALID_AMOUNT: u64 = 101;

    // -----------------------------------------
    // -------------- Constants ---------------
    // -----------------------------------------

    /// Role identifier for order executor
    const ROLE_GROUP_ADMIN: u8 = 1;

    // -----------------------------------------
    // --------------- Resources --------------
    // -----------------------------------------


    #[resource_group_member(group = supra_framework::object::ObjectGroup)]
    /// Controls object lifecycle operations
    struct ObjectController has key {
        /// Reference for extending object capabilities
        extend_ref: object::ExtendRef,
        /// Reference for deleting the object
        delete_ref: object::DeleteRef,
    }

    #[resource_group_member(group = supra_framework::object::ObjectGroup)]
    /// Configuration for a Investment Group
    struct GroupConfig <phantom InitialAsset> has store, key {
        /// Address of the user who created the Investment Group
        creator_address: address,
        /// Coins of the source asset type
        initial_asset_coins: Coin<InitialAsset>,
        /// Type information for source asset
        initial_asset_type_info: String,
        /// Timestamp when Group was created
        start_time: u64,
        /// Group Participants
        participants: GroupParticipants,
        /// Group Admins
        admins: GroupAdmins
    }

    /// Configuration for a Systematic Investment Plan
    struct GroupParticipants has store, key {
        particpants_invested_table: Table<address, u64>, // address mapped to amount invested
        participants_withdrawn_table: Table<address, u64> // address mapped to amount withdrawn
    }

    /// Admins of the Group
    struct GroupAdmins has store, key {
        admins: Table<address, u8> // address mapped to role
    }



    // -----------------------------------------
    // --------------- Events -----------------
    // -----------------------------------------

    #[event]
    /// Event emitted when a new Group is created
    struct GroupCreationEvent has drop, store {
        /// Address of the user who created the Investment Group
        creator_address: address,
        /// Type information for source asset
        initial_asset_type_info: String,
        /// Timestamp when the Investment Group was created
        start_time: u64,
    }

    #[event]
    /// Event emitted when a new participant invests in the group
    struct ParticipantJoinEvent has drop, store {
        /// Address of the user who joined the Investment Group
        participant_address: address,
        /// Amount invested by the participant
        amount_invested: u64,
        /// Type information for source asset
        initial_asset_type_info: String,
        /// Timestamp when the participant joined the Investment Group
        join_time: u64,
    }

    #[event]
    /// Event emitted when a participant withdraws from the group
    struct ParticipantWithdrawEvent has drop, store {
        /// Address of the user who withdrew from the Investment Group
        participant_address: address,
        /// Amount withdrawn by the participant
        amount_withdrawn: u64,
        /// Type information for source asset
        initial_asset_type_info: String,
        /// Timestamp when the participant withdrew from the Investment Group
        withdraw_time: u64,
    }

    #[event]
    /// Event emitted when a group creator swaps assets
    struct GroupSwapEvent has drop, store {
        /// Address of the user who created the Investment Group
        creator_address: address,
        /// Amount invested per order
        input_amount: u64,
        /// Type information for source asset
        x_type_info: String,
        /// Amount received after executing the order
        output_amount: u64,
        /// Type information for destination asset
        y_type_info: String,
        /// Timestamp when the order was executed
        time_stamp: u64,
    }

    // -----------------------------------------
    /// --------- Public Entry Functions --------
    // -----------------------------------------

    /// Creates a new Investment Group group with the specified asset type
    /// and initial investment amount
    /// # Parameters
    /// * `caller`: Signer creating the SIP group
    /// * `initial_asset`: Initial asset type for the SIP group
    entry fun create_group<InitialAsset> (
        caller: &signer,
    ) {
        let caller_address = signer::address_of(caller);
        // Creates the object
        let constructor_ref = object::create_object(caller_address);
        // Retrieves a signer for the object
        let object_signer = object::generate_signer(&constructor_ref);
        // Creates a transfer ref for controlling transfers
        let transfer_ref = object::generate_transfer_ref(&constructor_ref);
        // disables ungated transfer
        object::disable_ungated_transfer(&transfer_ref);
        // Creates an extend ref, and moves it to the object
        let extend_ref = object::generate_extend_ref(&constructor_ref);
        // Creates a delete ref, and moves it to the object
        let delete_ref = object::generate_delete_ref(&constructor_ref);

        move_to(&object_signer, ObjectController { extend_ref, delete_ref });

        let group_admins_table = table::new<address, u8>();
        table::add(&mut group_admins_table, caller_address, ROLE_GROUP_ADMIN);

        // Creates the GroupConfig resource
        let group_config = GroupConfig<InitialAsset> {
            creator_address: caller_address,
            initial_asset_coins: coin::zero<InitialAsset>(),
            initial_asset_type_info: type_info::type_name<InitialAsset>(),
            start_time: timestamp::now_seconds(),
            participants: GroupParticipants {
                particpants_invested_table: table::new<address, u64>(),
                participants_withdrawn_table: table::new<address, u64>()
            },
            admins: GroupAdmins {
                admins: group_admins_table
            }
        };

        // Moves the GroupConfig resource into the object
        move_to(&object_signer, group_config);

        event::emit(
            GroupCreationEvent {
                creator_address: caller_address,
                initial_asset_type_info: type_info::type_name<InitialAsset>(),
                start_time: timestamp::now_microseconds(),
            }
        );
    }

    /// Adds a new admin to the Investment Group group
    /// # Parameters
    /// * `caller`: Signer adding the participant
    /// * `group_address`: Address of the Investment Group
    /// * `admin_address`: Address of the participant
    ///
    /// # Aborts
    /// * If caller is not a group admin
    public entry fun add_group_admin<InitialAsset> (
        caller: &signer,
        group_address: address,
        admin_address: address
    ) acquires GroupConfig {
        let group_config = borrow_global_mut<GroupConfig<InitialAsset>>(group_address);
        let group_admins = &mut group_config.admins;
        let caller_address = signer::address_of(caller);
        let role = table::borrow(&group_admins.admins, caller_address);
        assert!(*role == ROLE_GROUP_ADMIN, 101);
        table::add(&mut group_admins.admins, admin_address, ROLE_GROUP_ADMIN);
    }

    /// Removes an admin from the Investment Group
    /// # Parameters
    /// * `caller`: Signer removing the participant
    /// * `group_address`: Address of the Investment Group
    /// * `admin_address`: Address of the participant
    ///
    /// # Aborts
    /// * If caller is not a group admin
    public entry fun remove_group_admin<InitialAsset> (
        caller: &signer,
        group_address: address,
        admin_address: address
    ) acquires GroupConfig {
        let group_config = borrow_global_mut<GroupConfig<InitialAsset>>(group_address);
        let group_admins = &mut group_config.admins;
        let caller_address = signer::address_of(caller);
        let role = table::borrow(&group_admins.admins, caller_address);
        assert!(*role == ROLE_GROUP_ADMIN, 101);
        table::remove(&mut group_admins.admins, admin_address);
    }

    /// Adds a new investment to the Group
    /// # Parameters
    /// * `caller`: Signer adding the participant
    /// * `group_address`: Address of the Investment Group
    /// * `amount`: Amount of coins to invest
    public entry fun invest_in_group<InitialAsset> (
        caller: &signer,
        group_address: address,
        amount: u64
    ) acquires GroupConfig {
        let group_config = borrow_global_mut<GroupConfig<InitialAsset>>(group_address);
        let caller_address = signer::address_of(caller);
        let participants = &mut group_config.participants;
        let invested = table::borrow(&participants.particpants_invested_table, caller_address);
        let withdrawn = table::borrow(&participants.participants_withdrawn_table, caller_address);
        let total_invested = *invested - *withdrawn;
        let new_investment = total_invested + amount;
        table::add(&mut participants.particpants_invested_table, caller_address, new_investment);
        let coins = coin::withdraw<InitialAsset>(caller, amount);
        coin::merge(&mut group_config.initial_asset_coins, coins);
        event::emit(
            ParticipantJoinEvent {
                participant_address: caller_address,
                amount_invested: amount,
                initial_asset_type_info: group_config.initial_asset_type_info,
                join_time: timestamp::now_microseconds(),
            }
        );
    }

    /// Withdraws an investment from the Investment Group
    /// # Parameters
    /// * `caller`: Signer withdrawing the investment
    /// * `group_address`: Address of the Investment Group
    /// * `amount`: Amount of coins to withdraw
    ///
    /// # Aborts
    /// * If caller is not a participant
    /// * If amount is greater than the total investment
    /// * If amount is zero
    public entry fun withdraw_from_group<InitialAsset> (
        caller: &signer,
        group_address: address,
        amount: u64
    ) acquires GroupConfig {
        let group_config = borrow_global_mut<GroupConfig<InitialAsset>>(group_address);
        let caller_address = signer::address_of(caller);
        let participants = &mut group_config.participants;
        let invested = table::borrow(&participants.particpants_invested_table, caller_address);
        let withdrawn = table::borrow(&participants.participants_withdrawn_table, caller_address);
        let total_invested = *invested - *withdrawn;
        assert!(amount > 0, EINVALID_AMOUNT);
        assert!(amount <= total_invested, EINVALID_AMOUNT);
        let new_withdrawn = *withdrawn + amount;
        table::add(&mut participants.participants_withdrawn_table, caller_address, new_withdrawn);
        let coins = coin::extract(&mut group_config.initial_asset_coins, amount);
        coin::deposit(caller_address, coins);
        event::emit(
            ParticipantWithdrawEvent {
                participant_address: caller_address,
                amount_withdrawn: amount,
                initial_asset_type_info: group_config.initial_asset_type_info,
                withdraw_time: timestamp::now_microseconds(),
            }
        );
    }

    /// Executes a Group Order using the Anqa swap aggregator
    /// # Parameters
    /// * `caller`: Signer executing the order
    /// * `object_address`: Address of the group
    /// * `amount`: Amount of coins to swap
    /// * `arg1 - arg48`: Anqa swap aggregator arguments
    ///
    /// # Aborts
    /// * If caller is not a group admin
    /// * If the group does not have enough coins to swap
    // public entry fun execute_group_order_anqa
    // <InitialAsset, ToAsset,
    //     // anqa swap aggregator type args
    //  T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20, T21, T22, T23, T24, T25, T26, T27, T28, T29, T30>
    // (caller: &signer, object_address: address, amount: u64,
    //  // anqa swap aggregator args
    //  // arg0: &signer, will be object_signer, insted of user here for anqa
    //  arg1: vector<u64>, arg2: vector<u64>, arg3: vector<u64>, arg4: vector<u64>, arg5: vector<u64>, arg6: vector<u64>, arg7: vector<u64>, arg8: vector<u64>, arg9: vector<u64>,
    //  arg10: vector<u64>, arg11: vector<u64>, arg12: vector<u64>, arg13: vector<u64>, arg14: vector<u64>, arg15: vector<u64>, arg16: vector<u64>, arg17: vector<u64>, arg18: vector<u64>, arg19: vector<u64>,
    //  arg20: vector<u64>, arg21: vector<u64>, arg22: vector<u64>, arg23: vector<u64>, arg24: vector<u64>, arg25: vector<u64>, arg26: vector<u64>, arg27: vector<u64>, arg28: vector<u64>, arg29: vector<u64>,
    //  arg30: vector<u64>, arg31: vector<u64>, arg32: vector<u64>, arg33: vector<u64>, arg34: vector<u64>, arg35: vector<u64>, arg36: vector<u64>, arg37: vector<u64>, arg38: vector<u64>, arg39: vector<u64>,
    //  arg40: vector<u64>, arg41: vector<u64>, arg42: vector<u64>, arg43: address, arg44: u64, arg45: u64, arg46: u64, arg47: 0x1::string::String, arg48: 0x1::string::String
    // ) acquires GroupConfig, ObjectController{
    //     let caller_address = signer::address_of(caller);
    //     let group_config = borrow_global_mut<GroupConfig<InitialAsset>>(object_address);
    //     let group_admins = &group_config.admins;
    //     let role = table::borrow(&group_admins.admins, caller_address);
    //     assert!(*role == ROLE_GROUP_ADMIN, 101);
    //
    //     let coins_to_swap = coin::extract(&mut group_config.initial_asset_coins, amount);
    //
    //     let object_signer = object::generate_signer_for_extending(&borrow_global<ObjectController>(object_address).extend_ref);
    //
    //     // deposit coins to object  for anqa swap
    //     if (!coin::is_account_registered<InitialAsset>(object_address)) {
    //         coin::register<InitialAsset>(&object_signer);
    //     };
    //
    //     coin::deposit<InitialAsset>(signer::address_of(&object_signer), coins_to_swap);
    //
    //     // execute anqa swap
    //     router::swap_generic_v4<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20, T21, T22, T23, T24, T25, T26, T27, T28, T29, T30>(
    //         &object_signer,
    //         arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15, arg16, arg17, arg18, arg19, arg20, arg21, arg22, arg23, arg24, arg25, arg26, arg27, arg28, arg29, arg30,
    //         arg31, arg32, arg33, arg34, arg35, arg36, arg37, arg38, arg39, arg40, arg41, arg42, arg43, arg44, arg45, arg46, arg47, arg48
    //     );
    //
    //     // get value of output coins and emit event
    //     let balance = coin::balance<ToAsset>(signer::address_of(&object_signer));
    //     event::emit(
    //         GroupSwapEvent {
    //             creator_address: caller_address,
    //             input_amount: amount,
    //             x_type_info: group_config.initial_asset_type_info,
    //             output_amount: balance,
    //             y_type_info: type_info::type_name<ToAsset>(),
    //             time_stamp: timestamp::now_microseconds(),
    //         }
    //     );
    //
    // }

    #[view]
    /// Returns the total investment of a participant
    /// # Parameters
    /// * `group_address`: Address of the Investment Group
    /// * `participant_address`: Address of the participant
    /// # Returns
    /// * Total investment of the participant
    public fun get_total_investment<InitialAsset>(
        group_address: address,
        participant_address: address
    ) : u64 acquires GroupConfig {
        let group_config = borrow_global<GroupConfig<InitialAsset>>(group_address);
        let participants = &group_config.participants;
        let invested = table::borrow(&participants.particpants_invested_table, participant_address);
        let withdrawn = table::borrow(&participants.participants_withdrawn_table, participant_address);
        *invested - *withdrawn
    }

    #[view]
    /// Checks is address is a group admin
    /// # Parameters
    /// * `group_address`: Address of the Investment Group
    /// * `admin_address`: Address of the admin
    /// # Returns
    /// * True if address is a group admin, false otherwise
    public fun is_group_admin<InitialAsset>(
        group_address: address,
        admin_address: address
    ) : bool acquires GroupConfig {
        let group_config = borrow_global<GroupConfig<InitialAsset>>(group_address);
        let group_admins = &group_config.admins;
        let role = table::borrow(&group_admins.admins, admin_address);
        let is_admin : bool = if (*role == ROLE_GROUP_ADMIN) {
            true
        } else {
            false
        };
        is_admin
    }
}
