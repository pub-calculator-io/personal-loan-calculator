<?php
/*
Plugin Name: CI Personal loan calculator
Plugin URI: https://www.calculator.io/personal-loan-calculator/
Description: After factoring the fees, insurance, and interest of a personal loan, this free personal loan calculator computes the monthly payment, true loan cost, and Annual percentage rate (APR).
Version: 1.0.0
Author: Personal Loan Calculator / www.calculator.io
Author URI: https://www.calculator.io/
License: GPLv2 or later
Text Domain: ci_personal_loan_calculator
*/

if (!defined('ABSPATH')) exit;

if (!function_exists('add_shortcode')) return "No direct call for Personal Loan Calculator by www.calculator.io";

function display_calcio_ci_personal_loan_calculator(){
    $page = 'index.html';
    return '<h2><img src="' . esc_url(plugins_url('assets/images/icon-48.png', __FILE__ )) . '" width="48" height="48">Personal Loan Calculator</h2><div><iframe style="background:transparent; overflow: scroll" src="' . esc_url(plugins_url($page, __FILE__ )) . '" width="100%" frameBorder="0" allowtransparency="true" onload="this.style.height = this.contentWindow.document.documentElement.scrollHeight + \'px\';" id="ci_personal_loan_calculator_iframe"></iframe></div>';
}


add_shortcode( 'ci_personal_loan_calculator', 'display_calcio_ci_personal_loan_calculator' );