module bagz::resource_account {
    use supra_framework::account::{Self, SignerCapability};
    use supra_framework::timestamp;
    use std::bcs;

    // -----------------------------------------
    // ------------ Friend Modules -------------
    // -----------------------------------------

    friend bagz::acl;
    friend bagz::groups;
    friend bagz::sip;

    // -----------------------------------------
    // --------------- Structs -----------------
    // -----------------------------------------

    /// Stores the signer capability for the resource account
    struct SignerCapabilityStore has key {
        signer_capability: SignerCapability
    }


    // ------------------------------------------
    // --------- Public Friend functions ---------
    // ------------------------------------------

    // Returns the address of the resource account
    //
    // # Returns
    // * `address`: The address of the resource account
    #[view]
    public(friend) fun get_address(): address acquires SignerCapabilityStore {
        let signer_capability_ref =
            &borrow_global<SignerCapabilityStore>(@bagz).signer_capability;
        account::get_signer_capability_address(signer_capability_ref)
    }

    /// Returns the signer of the resource account
    ///
    /// # Returns
    /// * `signer`: The signer of the resource account
    public(friend) fun get_signer(): signer acquires SignerCapabilityStore {
        let signer_capability_ref =
            &borrow_global<SignerCapabilityStore>(@bagz).signer_capability;
        account::create_signer_with_capability(signer_capability_ref)
    }

    // ------------------------------------------
    // ------------ Private functions -----------
    // ------------------------------------------

    /// Initializes the module by creating a resource account and storing its signer capability
    ///
    /// # Parameters
    /// * `admin`: The signer of the admin account
    fun init_module(admin: &signer) {
        let time_seed = bcs::to_bytes(&timestamp::now_microseconds());
        let (_, signer_capability) =
            account::create_resource_account(admin, time_seed);
        move_to(admin, SignerCapabilityStore{signer_capability});
    }

    #[test_only]
    struct TestStruct has key {}

    #[test_only]
    /// Initialize resource account for testing.
    public fun init_test() {
        // Get signer for Aptos framework account.
        let supra_framework = account::create_signer_with_capability(
            &account::create_test_signer_cap(@supra_framework));
        // Set time for seed.
        timestamp::set_time_has_started_for_testing(&supra_framework);
        let bagz = account::create_signer_with_capability(
            &account::create_test_signer_cap(@bagz));
        init_module(&bagz); // Init resource account.
    }


    #[test]
    /// Verify initialization, signer use, address lookup.
    fun test_mixed()
    acquires SignerCapabilityStore {
        init_test(); // Init the resource account.
        // Move to resource account a test struct.
        move_to<TestStruct>(&get_signer(), TestStruct{});
        // Verify existence via address lookup.
        assert!(exists<TestStruct>(get_address()), 0);
    }
}