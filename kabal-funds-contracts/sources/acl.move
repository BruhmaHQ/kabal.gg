/// This module implements an Access Control List (ACL).
/// It manages roles and permissions for various administrative functions.
module bagz::acl {
    use std::error;
    use std::signer;

    use supra_framework::table::{Self, Table};
    use bagz::resource_account;

    friend bagz::groups;
    friend bagz::sip;

    #[test_only]
    use supra_framework::account;

    // -----------------------------------------
    // -------------- Error codes --------------
    // -----------------------------------------

    /// The role number is too large (must be less than 128)
    const EROLE_NUMBER_TOO_LARGE: u64 = 0;
    /// Only ACL admin can set or remove roles
    const EONLY_ACL_ADMIN_CAN_SET_OR_REMOVE_ROLES: u64 = 1;
    /// The ACL has already been initialized
    const EALREADY_INITIALIZED: u64 = 2;

    // -----------------------------------------
    // ------------ Role Constants -------------
    // -----------------------------------------

    /// Role for ACL administrators
    const ROLE_ACL_ADMIN: u8 = 0;
    /// Role for fee administrators
    const ROLE_ORDER_EXECUTOR: u8 = 1;


    // -----------------------------------------
    // --------------- Structs -----------------
    // -----------------------------------------

    /// Struct representing the Access Control List
    struct ACL has store, key {
        /// Table of permissions for each member
        permissions: Table<address, u128>
    }


    // ------------------------------------------
    // --------- Public Entry functions ---------
    // ------------------------------------------


    /// Initializes the ACL
    ///
    /// # Parameters
    /// * `_sender`: The signer initializing the ACL (unused)
    ///
    /// # Aborts
    /// Aborts if the ACL has already been initialized
    fun init_module(_sender: &signer){
        assert!(!exists<ACL>(resource_account::get_address()), EALREADY_INITIALIZED);
        let acl = new();

        if (table::contains(&acl.permissions, @bagz)) {
            let perms = table::borrow_mut(&mut acl.permissions, @bagz);
            *perms = *perms | (1 << ROLE_ACL_ADMIN);
        } else {
            table::add(&mut acl.permissions, @bagz, 1 << ROLE_ACL_ADMIN);
        };

        move_to(&resource_account::get_signer(), acl);
        // uncomment to add fee admin role to bagz
        // add_role(@bagz, ROLE_ORDER_EXECUTOR);
    }


    // ------------------------------------------
    // ------------ Public Entry functions ------------
    // ------------------------------------------


    /// Checks if a member has a specific role
    ///
    /// # Parameters
    /// * `member`: The address of the member to check
    /// * `role`: The role to check for
    ///
    /// # Returns
    /// * `bool` - Whether the member has the specified role
    public fun has_role(member: address, role: u8): bool acquires ACL {
        let acl = borrow_global_mut<ACL>(resource_account::get_address());
        assert!(role < 128, error::invalid_argument(EROLE_NUMBER_TOO_LARGE));
        table::contains(&acl.permissions, member) && *table::borrow(&acl.permissions, member) & (1 << role) > 0
    }


    /// Sets the roles for a member
    ///
    /// # Parameters
    /// * `member`: The address of the member to set roles for
    /// * `permissions`: The permissions to set for the member
    ///
    /// # Aborts
    /// Aborts if the caller is not an ACL admin
    public entry fun set_roles(admin : &signer, member: address, permissions: u128) acquires ACL {
        assert!(has_role(signer::address_of(admin), ROLE_ACL_ADMIN), EONLY_ACL_ADMIN_CAN_SET_OR_REMOVE_ROLES);
        let acl = borrow_global_mut<ACL>(resource_account::get_address());
        if (table::contains(&acl.permissions, member)) {
            *table::borrow_mut(&mut acl.permissions, member) = permissions
        } else {
            table::add(&mut acl.permissions, member, permissions);
        }
    }

    /// Adds a role to a member
    ///
    /// # Parameters
    /// * `member`: The address of the member to add the role to
    /// * `role`: The role to add
    ///
    /// # Aborts
    /// Aborts if the caller is not an ACL admin or if the role number is too large
    public fun add_role(admin : &signer, member: address, role: u8) acquires ACL {
        assert!(has_role(signer::address_of(admin), ROLE_ACL_ADMIN), EONLY_ACL_ADMIN_CAN_SET_OR_REMOVE_ROLES);
        let acl = borrow_global_mut<ACL>(resource_account::get_address());
        assert!(role < 128, EROLE_NUMBER_TOO_LARGE);
        if (table::contains(&acl.permissions, member)) {
            let perms = table::borrow_mut(&mut acl.permissions, member);
            *perms = *perms | (1 << role);
        } else {
            table::add(&mut acl.permissions, member, 1 << role);
        }
    }

    /// Removes a role from a member
    ///
    /// # Parameters
    /// * `member`: The address of the member to remove the role from
    /// * `role`: The role to remove
    ///
    /// # Aborts
    /// Aborts if the caller is not an ACL admin or if the role number is too large
    public fun remove_role(admin : &signer, member: address, role: u8) acquires ACL {
        assert!(has_role(signer::address_of(admin), ROLE_ACL_ADMIN), EONLY_ACL_ADMIN_CAN_SET_OR_REMOVE_ROLES);
        let acl = borrow_global_mut<ACL>(resource_account::get_address());
        assert!(role < 128, error::invalid_argument(EROLE_NUMBER_TOO_LARGE));
        if (table::contains(&acl.permissions, member)) {
            let perms = table::borrow_mut(&mut acl.permissions, member);
            *perms = *perms - (1 << role);
        }
    }


    // ------------------------------------------
    // ------------ Private functions -----------
    // ------------------------------------------

    /// Creates a new ACL instance
    ///
    /// # Returns
    /// * `ACL` - A new ACL instance
    fun new(): ACL {
        ACL { permissions: table::new() }
    }

    #[test_only]
    public fun init_test()  {
        let bagz = account::create_signer_with_capability(
            &account::create_test_signer_cap(@bagz));
        resource_account::init_test();
        init_module(&bagz);
    }

    #[test]
    fun test_successful_initialization() acquires  ACL {
        init_test();
        assert!(has_role(@bagz, ROLE_ACL_ADMIN), 0);
    }

    #[test]
    fun test_add_role_by_admin() acquires  ACL {
        init_test();
        let bagz = account::create_signer_with_capability(
            &account::create_test_signer_cap(@bagz));
        add_role(&bagz, @0x123, ROLE_ORDER_EXECUTOR);
        assert!(has_role(@0x123, ROLE_ORDER_EXECUTOR), 0);
    }

    #[test(not_admin = @0xC0FFEE)]
    #[expected_failure(abort_code = 1, location = Self)]
    fun test_add_role_by_non_admin_fails(not_admin: &signer) acquires  ACL {
        init_test();
        add_role(not_admin, @0x123, ROLE_ORDER_EXECUTOR);
    }

    #[test]
    fun test_remove_role() acquires  ACL {
        init_test();
        let bagz = account::create_signer_with_capability(
            &account::create_test_signer_cap(@bagz));
        add_role(&bagz, @0x123, ROLE_ORDER_EXECUTOR);
        assert!(has_role(@0x123, ROLE_ORDER_EXECUTOR), 0);

        remove_role(&bagz, @0x123, ROLE_ORDER_EXECUTOR);
        assert!(!has_role(@0x123, ROLE_ORDER_EXECUTOR), 1);
    }

    #[test]
    #[expected_failure(abort_code = 0, location = Self)] // EROLE_NUMBER_TOO_LARGE
    fun test_role_number_too_large() acquires  ACL {
        init_test();
        let bagz = account::create_signer_with_capability(
            &account::create_test_signer_cap(@bagz));
        add_role(&bagz, @0x123, 128); // Should fail
    }

    #[test]
    fun test_set_roles() acquires  ACL {
        init_test();
        let bagz = account::create_signer_with_capability(
        &account::create_test_signer_cap(@bagz));

        // Set multiple roles at once using bitmask
        let test_role_two = 2;
        let permissions = 1 << test_role_two | 1 << ROLE_ORDER_EXECUTOR;
        set_roles(&bagz, @0x123, permissions);

        // Verify both roles were set
        assert!(has_role(@0x123, test_role_two), 0);
        assert!(has_role(@0x123, ROLE_ORDER_EXECUTOR), 1);
    }

    #[test]
    fun test_has_role_nonexistent_member() acquires  ACL {
        init_test();
        // Check role for address that was never added to ACL
        assert!(!has_role(@0x999, ROLE_ORDER_EXECUTOR), 0);
    }

    #[test]
    fun test_remove_nonexistent_role() acquires  ACL {
        init_test();
        let bagz = account::create_signer_with_capability(
            &account::create_test_signer_cap(@bagz));

        // Should not fail when removing a role that doesn't exist
        remove_role(&bagz, @0x123, ROLE_ORDER_EXECUTOR);
        assert!(!has_role(@0x123, ROLE_ORDER_EXECUTOR), 0);
    }


}