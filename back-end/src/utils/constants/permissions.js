// Permission constants
const PERMISSIONS = {
  // Restaurant
  CAN_CREATE_RESTAURANT: "CAN_CREATE_RESTAURANT",
  CAN_VIEW_RESTAURANT: "CAN_VIEW_RESTAURANT",
  CAN_VIEW_RESTAURANTS: "CAN_VIEW_RESTAURANTS",
  CAN_UPDATE_RESTAURANT: "CAN_UPDATE_RESTAURANT",
  CAN_DELETE_RESTAURANT: "CAN_DELETE_RESTAURANT",

  // Menu
  CAN_CREATE_MENU: "CAN_CREATE_MENU",
  CAN_VIEW_MENU: "CAN_VIEW_MENU",
  CAN_UPDATE_MENU: "CAN_UPDATE_MENU",
  CAN_DELETE_MENU: "CAN_DELETE_MENU",

  // Menu Item
  CAN_CREATE_MENU_ITEM: "CAN_CREATE_MENU_ITEM",
  CAN_VIEW_MENU_ITEM: "CAN_VIEW_MENU_ITEM",
  CAN_UPDATE_MENU_ITEM: "CAN_UPDATE_MENU_ITEM",
  CAN_DELETE_MENU_ITEM: "CAN_DELETE_MENU_ITEM",

  // Order
  CAN_CREATE_ORDER: "CAN_CREATE_ORDER",
  CAN_VIEW_ORDER: "CAN_VIEW_ORDER",
  CAN_UPDATE_ORDER: "CAN_UPDATE_ORDER",
  CAN_DELETE_ORDER: "CAN_DELETE_ORDER",
  CAN_COMPLETE_ORDER: "CAN_COMPLETE_ORDER",

  // Bill
  CAN_CREATE_BILL: "CAN_CREATE_BILL",
  CAN_VIEW_BILL: "CAN_VIEW_BILL",
  CAN_UPDATE_BILL: "CAN_UPDATE_BILL",
  CAN_DELETE_BILL: "CAN_DELETE_BILL",

  // Table
  CAN_CREATE_TABLE: "CAN_CREATE_TABLE",
  CAN_VIEW_TABLE: "CAN_VIEW_TABLE",
  CAN_UPDATE_TABLE: "CAN_UPDATE_TABLE",
  CAN_DELETE_TABLE: "CAN_DELETE_TABLE",
  CAN_SEARCH_TABLE: "CAN_SEARCH_TABLE",

  // Reservation
  CAN_CREATE_RESERVATION: "CAN_CREATE_RESERVATION",
  CAN_VIEW_RESERVATION: "CAN_VIEW_RESERVATION",
  CAN_UPDATE_RESERVATION: "CAN_UPDATE_RESERVATION",
  CAN_DELETE_RESERVATION: "CAN_DELETE_RESERVATION",
  CAN_ASSIGN_TABLE_TO_RESERVATION: "CAN_ASSIGN_TABLE_TO_RESERVATION",
  CAN_MARK_RESERVATION_COMPLETED: "CAN_MARK_RESERVATION_COMPLETED",
  CAN_CANCEL_RESERVATION: "CAN_CANCEL_RESERVATION",

  // User/Staff
  CAN_CREATE_USER: "CAN_CREATE_USER",
  CAN_VIEW_USER: "CAN_VIEW_USER",
  CAN_VIEW_USERS: "CAN_VIEW_USERS",
  CAN_UPDATE_USER: "CAN_UPDATE_USER",
  CAN_DELETE_USER: "CAN_DELETE_USER",

  // Payment
  CAN_CREATE_PAYMENT: "CAN_CREATE_PAYMENT",
  CAN_VIEW_PAYMENT: "CAN_VIEW_PAYMENT",
  CAN_UPDATE_PAYMENT: "CAN_UPDATE_PAYMENT",
  CAN_DELETE_PAYMENT: "CAN_DELETE_PAYMENT",

  // Admin/Analytics
  CAN_VIEW_ANALYTICS: "CAN_VIEW_ANALYTICS",
  CAN_MANAGE_STAFF: "CAN_MANAGE_STAFF",
  CAN_EXPORT_REPORTS: "CAN_EXPORT_REPORTS",

  // Auth/Other
  CAN_VERIFY_TOKEN: "CAN_VERIFY_TOKEN",
  CAN_RESET_PASSWORD: "CAN_RESET_PASSWORD",
  CAN_FORGOT_PASSWORD: "CAN_FORGOT_PASSWORD",

  // user
  CAN_CREATE_USER: "CAN_CREATE_USER",
  CAN_VIEW_USER: "CAN_VIEW_USER",
  CAN_VIEW_USERS: "CAN_VIEW_USERS",
  CAN_UPDATE_USER: "CAN_UPDATE_USER",
  CAN_DELETE_USER: "CAN_DELETE_USER"
};

// Default permissions for each role
const ROLE_PERMISSIONS = {
  Owner: Object.values(PERMISSIONS),

  Staff: [
    PERMISSIONS.CAN_VIEW_MENU,
    PERMISSIONS.CAN_VIEW_ORDERS,
    PERMISSIONS.CAN_VIEW_BILLS,
    PERMISSIONS.CAN_CREATE_RESERVATION,
    PERMISSIONS.CAN_VIEW_RESERVATION,
    PERMISSIONS.CAN_UPDATE_RESERVATION,
    PERMISSIONS.CAN_DELETE_RESERVATION,
    PERMISSIONS.CAN_VIEW_USER,
    PERMISSIONS.CAN_UPDATE_USER,
  ],
  Customer: [
    PERMISSIONS.CAN_VIEW_MENU,
    PERMISSIONS.CAN_CREATE_RESERVATION,
    PERMISSIONS.CAN_VIEW_RESERVATION,
  ],
};

module.exports = { PERMISSIONS, ROLE_PERMISSIONS }; 