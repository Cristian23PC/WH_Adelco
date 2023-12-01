export const analyticsEvents = {
  EVENT_NAMES: {
    VIEW_HOMEPAGE: 'view_homepage',
    VIEW_ITEM_LIST: 'view_item_list',
    VIEW_ITEM_PAGE: 'view_item_page',
    SEARCH_PRODUCTS: 'search_products',
    SEARCH_EMPTY_RESULTS: 'search_empty_results',
    SEE_PRICES: 'see_prices',
    OPEN_LOGIN: 'open_login',
    LOGIN_SUCCESS: 'login_success',
    OPEN_PASSWORD_RECOVERY: 'open_password_recovery',
    SELECT_LOCATION: 'select_location',
    OPEN_CHANGE_ADDRESS: 'open_change_address',
    ADD_EMAIL_PASSWORD_RECOVERY: 'add_email_password_recovery',
    COMPANY_REGISTRATION_STEP1: 'company_registration_step1',
    COMPANY_REGISTRATION_NEW_COMPANY_SUCCESS:
      'company_registration_new_company_success',
    COMPANY_REGISTRATION_USER_VALIDATION_SUCCESS:
      'company_registration_user_validation_success',
    COMPANY_REGISTRATION_DROP_OFF: 'company_registration_drop_off',
    VIEW_CHECKOUT: 'view_checkout',
    PURCHASE: 'purchase',
    PURCHASE_FAILED: 'purchase_failed',
    ADD_TO_CART: 'add_to_cart',
    VIEW_CART: 'view_cart',
    CONFIRM_CART: 'confirm_cart',
    ASK_FOR_A_QUOTE: 'ask_for_a_quote',
    OPEN_FILTERS_TAB: 'open_filters_tab',
    SELECT_FILTERS: 'select_filters',
    OPEN_SORTING_TAB: 'open_sorting_tab',
    SELECT_SORT_CRITERIA: 'select_sort_criteria'
  },
  STATUS: {
    SUCCESS: 'Success',
    ERROR: 'Failed',
    BUSINESS_ERROR: 'Business error'
  }
} as const;
