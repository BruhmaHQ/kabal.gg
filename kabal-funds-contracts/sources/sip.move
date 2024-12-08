/// This module implements a Systematic Investment Plan (SIP) functionality for automated periodic investments
/// between different asset types using the Anqa router for swaps.
module bagz::sip {
    use std::signer;
    use std::string::String;

    use supra_framework::coin::{Self, Coin};
    use supra_framework::event::{Self};
    use supra_framework::timestamp;
    use supra_framework::object;

    use aptos_std::type_info;
    // use supra_std::table::{Table};
    // use supra_framework::supra_account;

    // use anqa::router;
    // use bagz::acl;

    // -----------------------------------------
    // -------------- Error codes --------------
    // -----------------------------------------

    /// Order amount must be greater than zero
    const EINVALID_AMOUNT: u64 = 101;
    /// Trigger time must be greater than minimum required time
    const EINVALID_TRIGGER_TIME: u64 = 102;
    /// Total number of orders must be greater than zero
    const EINVALID_TOTAL_ORDERS: u64 = 103;
    /// Source and destination assets must be different
    const EINVALID_ASSET_TYPE: u64 = 104;

    // -----------------------------------------
    // -------------- Constants ---------------
    // -----------------------------------------

    /// Default minimum exchange amount per order
    const DEFAULT_MIN_EXCHANGE_AMOUNT_PER_ORDER: u64 = 0;
    /// Default maximum exchange amount per order (u64 max value)
    const DEFAULT_MAX_EXCHANGE_AMOUNT_PER_ORDER: u64 = 18446744073709551613;
    /// Minimum time between orders (5 minutes in seconds)
    const MIN_TRIGGER_TIME_IN_SECONDS: u64 = 300;
    /// Allowed delay window for order execution
    const ORDER_EXECUTION_ALLOWED_DELAY: u64 = 30;
    /// Role identifier for order executor
    const ROLE_ORDER_EXECUTOR: u8 = 1;

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
    /// Configuration for a Systematic Investment Plan
    struct SipConfig <phantom FromAsset> has store, key {
        /// Address of the user who created the SIP
        user_address: address,
        /// Coins of the source asset type
        from_asset_coins: Coin<FromAsset>,
        /// Type information for source asset
        from_asset_type_info: String,
        /// Type information for destination asset
        to_asset_type_info: String,
        /// Timestamp when SIP was created
        start_time: u64,
        /// Delay before first order execution
        first_order_delay: u64,
        /// Total number of orders to execute
        total_orders: u64,
        /// Total amount to be invested
        total_amount: u64,
        /// Amount per individual order
        amount_per_order: u64,
        /// Time interval between orders
        trigger_time_in_seconds: u64,
        /// Minimum acceptable exchange amount per order
        min_exchange_amount_per_order: u64,
        /// Maximum acceptable exchange amount per order
        max_exchange_amount_per_order: u64,
        /// Number of orders executed so far
        order_counter: u64,
    }

    // -----------------------------------------
    // --------------- Events -----------------
    // -----------------------------------------

    #[event]
    /// Event emitted when a new SIP order is placed
    struct SipPlaceOrder has drop, store {
        /// Address of the user who placed the order
        user_address: address,
        /// Amount to be invested per order
        trigger_amount: u64,
        /// Time interval between orders
        trigger_time: u64,
        /// Type information for source asset
        x_type_info: String,
        /// Type information for destination asset
        y_type_info: String,
        /// Timestamp when the order was placed
        time_stamp: u64,
        /// Flag indicating if the order is active
        is_active: bool,
    }

    #[event]
    /// Event emitted when a SIP order is cancelled
    struct SipCancelOrder has drop, store {
        /// Address of the user who cancelled the order
        user_address: address,
        /// Amount to be refunded
        amount: u64,
        /// Type information for source asset
        x_type_info: String,
        /// Timestamp when the order was cancelled
        time_stamp: u64,
    }

    #[event]
    /// Event emitted when a SIP order is executed
    struct SipExecuteOrder has drop, store {
        /// Address of the user who placed the order
        user_address: address,
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
    // --------- Public Entry Functions --------
    // -----------------------------------------

    /// Creates a new SIP order with specified parameters
    ///
    /// # Parameters
    /// * `caller`: Signer creating the SIP order
    /// * `amount_per_order`: Amount to invest in each order
    /// * `trigger_time_in_seconds`: Time interval between orders
    /// * `total_orders`: Total number of orders to execute
    /// * `first_order_delay`: Delay before first order execution
    /// * `min_exchange_amount_per_order`: Minimum acceptable exchange amount
    /// * `max_exchange_amount_per_order`: Maximum acceptable exchange amount
    ///
    /// # Aborts
    /// * If amount is zero
    /// * If trigger time is less than minimum required
    /// * If total orders is zero
    /// * If source and destination assets are the same
    entry fun create_sip_order<FromAsset, ToAsset> (
        caller: &signer,
        amount_per_order: u64,
        trigger_time_in_seconds: u64,
        total_orders: u64,
        first_order_delay: u64,
        min_exchange_amount_per_order: u64,
        max_exchange_amount_per_order: u64
    ) {
        assert!(amount_per_order > 0, EINVALID_AMOUNT);
        assert!(trigger_time_in_seconds >= MIN_TRIGGER_TIME_IN_SECONDS, EINVALID_TRIGGER_TIME);
        assert!(total_orders > 0, EINVALID_TOTAL_ORDERS);
        assert!(type_info::type_name<FromAsset>() != type_info::type_name<ToAsset>(), EINVALID_ASSET_TYPE);

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

        // Withdraws the total amount from the caller
        let total_amount = amount_per_order * total_orders;
        let from_asset_coins = coin::withdraw<FromAsset>(caller, total_amount);

        let start_time = timestamp::now_seconds();

        // Creates the SipConfig resource
        let sip_config = SipConfig<FromAsset> {
            user_address: caller_address,
            from_asset_coins,
            from_asset_type_info: type_info::type_name<FromAsset>(),
            to_asset_type_info: type_info::type_name<ToAsset>(),
            start_time,
            first_order_delay,
            total_orders,
            total_amount,
            amount_per_order,
            trigger_time_in_seconds,
            order_counter: 0,
            min_exchange_amount_per_order,
            max_exchange_amount_per_order,
        };

        // Moves the SipConfig resource into the object
        move_to(&object_signer, sip_config);

        event::emit(
            SipPlaceOrder {
                user_address: caller_address,
                trigger_amount: amount_per_order,
                trigger_time: trigger_time_in_seconds,
                x_type_info: type_info::type_name<FromAsset>(),
                y_type_info: type_info::type_name<ToAsset>(),
                time_stamp: timestamp::now_microseconds(),
                is_active: true,
            }
        );
    }

    /// Executes a SIP order using the Anqa router for swapping assets
    ///
    /// # Type Parameters
    /// * `FromAsset`: Source asset type
    /// * `ToAsset`: Destination asset type
    /// * `T0` - `T30`: Anqa swap aggregator type arguments
    ///
    /// # Parameters
    /// * `caller`: Signer executing the order
    /// * `object_address`: Address of the SIP order object
    /// * Multiple arguments required by Anqa swap router
    ///
    /// # Aborts
    /// * If caller doesn't have executor role
    /// * If order counter exceeds total orders
    /// * If execution time is outside allowed window
    /// * If exchange amounts are outside bounds
    // public entry fun execute_sip_order_anqa
    // <FromAsset, ToAsset,
    //  // anqa swap aggregator type args
    //  T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20, T21, T22, T23, T24, T25, T26, T27, T28, T29, T30>
    // (caller: &signer, object_address: address,
    //     // anqa swap aggregator args
    //  // arg0: &signer, will be object_signer, insted of user here for anqa
    //  arg1: vector<u64>, arg2: vector<u64>, arg3: vector<u64>, arg4: vector<u64>, arg5: vector<u64>, arg6: vector<u64>, arg7: vector<u64>, arg8: vector<u64>, arg9: vector<u64>,
    //  arg10: vector<u64>, arg11: vector<u64>, arg12: vector<u64>, arg13: vector<u64>, arg14: vector<u64>, arg15: vector<u64>, arg16: vector<u64>, arg17: vector<u64>, arg18: vector<u64>, arg19: vector<u64>,
    //  arg20: vector<u64>, arg21: vector<u64>, arg22: vector<u64>, arg23: vector<u64>, arg24: vector<u64>, arg25: vector<u64>, arg26: vector<u64>, arg27: vector<u64>, arg28: vector<u64>, arg29: vector<u64>,
    //  arg30: vector<u64>, arg31: vector<u64>, arg32: vector<u64>, arg33: vector<u64>, arg34: vector<u64>, arg35: vector<u64>, arg36: vector<u64>, arg37: vector<u64>, arg38: vector<u64>, arg39: vector<u64>,
    //  arg40: vector<u64>, arg41: vector<u64>, arg42: vector<u64>, arg43: address, arg44: u64, arg45: u64, arg46: u64, arg47: 0x1::string::String, arg48: 0x1::string::String
    // ) acquires SipConfig, ObjectController{
    //     assert!(acl::has_role(signer::address_of(caller), ROLE_ORDER_EXECUTOR), 107 );
    //
    //     let sip_config = borrow_global_mut<SipConfig<FromAsset>>(object_address);
    //     let sip_owner = sip_config.user_address;
    //     let extend_ref = &borrow_global<ObjectController>(object_address).extend_ref;
    //     let object_signer = object::generate_signer_for_extending(extend_ref);
    //     let current_time = timestamp::now_seconds();
    //     let start_time = sip_config.start_time;
    //     let first_order_delay = sip_config.first_order_delay;
    //     let total_orders = sip_config.total_orders;
    //     let counter = sip_config.order_counter;
    //     let amount_per_order = sip_config.amount_per_order;
    //     let trigger_time_in_seconds = sip_config.trigger_time_in_seconds;
    //     // let total_amount = sip_config.total_amount;
    //     let min_exchange_amount_per_order = sip_config.min_exchange_amount_per_order;
    //     let max_exchange_amount_per_order = sip_config.max_exchange_amount_per_order;
    //
    //
    //     assert!(counter <= total_orders, 105);
    //     let (allowed_min_time, allowed_max_time) = (start_time + first_order_delay + (counter * trigger_time_in_seconds) - ORDER_EXECUTION_ALLOWED_DELAY, start_time + first_order_delay + (counter  * trigger_time_in_seconds) + ORDER_EXECUTION_ALLOWED_DELAY);
    //     assert!(current_time >= allowed_min_time && current_time <= allowed_max_time, 106);
    //
    //     let from_coins = coin::extract(&mut sip_config.from_asset_coins, amount_per_order);
    //     // coin::deposit(signer::address_of(&object_signer), from_coins);
    //     // deposit coins to object  for anqa swap
    //     if (!coin::is_account_registered<FromAsset>(object_address)) {
    //         coin::register<FromAsset>(&object_signer);
    //     };
    //     coin::deposit<FromAsset>(signer::address_of(&object_signer), from_coins);
    //
    //     // execute anqa swap
    //     router::swap_generic_v4<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20, T21, T22, T23, T24, T25, T26, T27, T28, T29, T30>(
    //         &object_signer,
    //         arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15, arg16, arg17, arg18, arg19, arg20, arg21, arg22, arg23, arg24, arg25, arg26, arg27, arg28, arg29, arg30,
    //         arg31, arg32, arg33, arg34, arg35, arg36, arg37, arg38, arg39, arg40, arg41, arg42, arg43, arg44, arg45, arg46, arg47, arg48
    //     );
    //
    //     // get the output coins from anqa swap and check the amount bounds
    //     let balance = coin::balance<ToAsset>(signer::address_of(&object_signer));
    //     assert!(balance >= min_exchange_amount_per_order, 108);
    //     assert!(balance <= max_exchange_amount_per_order, 109);
    //
    //     // deposit the output coins to user that created the sip order
    //     let output_coins = coin::withdraw<ToAsset>(&object_signer, balance);
    //     supra_account::deposit_coins(sip_owner, output_coins);
    //
    //     // update the order counter
    //     sip_config.order_counter = counter + 1;
    //
    //     event::emit(
    //         SipExecuteOrder {
    //             user_address: sip_owner,
    //             input_amount: amount_per_order,
    //             x_type_info: sip_config.from_asset_type_info,
    //             output_amount: balance,
    //             y_type_info: sip_config.to_asset_type_info,
    //             time_stamp: timestamp::now_microseconds(),
    //         }
    //     )
    //
    // }

    /// Cancels an existing SIP order and returns remaining funds
    ///
    /// # Parameters
    /// * `account`: Signer cancelling the order
    /// * `object_address`: Address of the SIP order object
    /// * `amount`: Amount of coins to withdraw
    ///
    /// # Aborts
    /// * If caller is not the SIP owner
    public entry fun cancel_order_entry<CoinType>(
        account: &signer,
        object_address: address,
        amount: u64
    ) acquires  SipConfig
    // ObjectController
    {

        let sip_config = borrow_global_mut<SipConfig<CoinType>>(object_address);
        let sip_owner = sip_config.user_address;
        assert!(signer::address_of(account) == sip_owner, 103);

        let coins_value_remaning = coin::extract(&mut sip_config.from_asset_coins, amount);
        coin::deposit(sip_owner, coins_value_remaning);

        event::emit(
            SipCancelOrder {
                user_address: sip_owner,
                amount,
                x_type_info: sip_config.from_asset_type_info,
                time_stamp: timestamp::now_microseconds(),
            }
        );

        // let object_controller = borrow_global_mut<ObjectController>(object_address);

        // delete the object
        // object::delete(object_controller.delete_ref);
        
    }

}
