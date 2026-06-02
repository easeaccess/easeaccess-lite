<?php

namespace EaseAccess_Lite\Admin;

defined( 'ABSPATH' ) || exit;

/**
 * EaseAccess Admin Class
 *
 * @package EaseAccess\Admin
 * @since 0.0.1
 */
class Admin {
    /**
     * Constructor
     */
    public function __construct() {
        // Add admin hooks and filters here
        add_action( 'admin_init', array( $this, 'easeaccess_admin_init' ) );
        add_action( 'admin_menu', array( $this, 'register_admin_menu' ) );
    }

    /**
     * Admin Init
     *
     * @return void
     */
    public function easeaccess_admin_init() {
        // Initialization code for the admin area

    }

    /**
     * Register admin menu
     *
     * @return void
     */
    public function register_admin_menu() {
        add_menu_page(
            __( 'EaseAccess Lite', 'easeaccess-lite' ),
            __( 'EaseAccess Lite', 'easeaccess-lite' ),
            'manage_options',
            'easeaccess-lite',
            array( $this, 'admin_page_content' ),
            'dashicons-universal-access-alt',
            100
        );
    }

    /**
     * Admin page content
     *
     * @return void
     */
    public function admin_page_content() {
        echo '<div id="' . esc_attr( 'zone7-accessibility' ) . '"></div>';
    }
}