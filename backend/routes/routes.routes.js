const express = require("express");
const route = express.Router();
const public_routes = require("./public.routes");

const index = "index";
const index_without_nav = "index-without-nav";
const index_error = "index-error";

route.use(function (req, res, next) {
  let url_replace_options = req.url.replace("?", "").replace("/", "");
  let routes = {};
  for (var key in public_routes) {
    routes[key] = public_routes[key].replace("/", "");
  }
  res.locals.routes = routes;
  res.locals.active_path = url_replace_options;
  next();
});

//   -------------- ( Auth ) ------------------

route.get(public_routes.login, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Login",
    layout: index_without_nav,
    page_path: "login",
  });
});
route.get(public_routes.login_2, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Login 2",
    layout: index_without_nav,
    page_path: "login-2",
  });
});
route.get(public_routes.login_3, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Login 3",
    layout: index_without_nav,
    page_path: "login-3",
  });
});
route.get(public_routes.coming_soon, (req, res, next) => {
  res.render(index_without_nav, {
    title: "coming soon",
    layout: index_without_nav,
    page_path: "coming-soon",
  });
});

route.get(public_routes.register, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Register",
    layout: index_without_nav,
    page_path: "register",
  });
});
route.get(public_routes.register_2, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Register 2",
    layout: index_without_nav,
    page_path: "register-2",
  });
});
route.get(public_routes.register_3, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Register 3",
    layout: index_without_nav,
    page_path: "register-3",
  });
});

route.get(public_routes.forgot_password, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Forgot password",
    layout: index_without_nav,
    page_path: "forgot-password",
  });
});
route.get(public_routes.forgot_password_2, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Forgot password 2",
    layout: index_without_nav,
    page_path: "forgot-password-2",
  });
});
route.get(public_routes.forgot_password_3, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Forgot password 3",
    layout: index_without_nav,
    page_path: "forgot-password-3",
  });
});

route.get(public_routes.reset_password, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Reset password",
    layout: index_without_nav,
    page_path: "reset-password",
  });
});
route.get(public_routes.reset_password_2, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Reset password 2",
    layout: index_without_nav,
    page_path: "reset-password-2",
  });
});
route.get(public_routes.reset_password_3, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Reset password 3",
    layout: index_without_nav,
    page_path: "reset-password-3",
  });
});
route.get(public_routes.email_verification, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Email Verification",
    layout: index_without_nav,
    page_path: "email-verification",
  });
});
route.get(public_routes.email_verification_2, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Email Verification 2",
    layout: index_without_nav,
    page_path: "email-verification-2",
  });
});
route.get(public_routes.email_verification_3, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Email Verification 3",
    layout: index_without_nav,
    page_path: "email-verification-3",
  });
});
route.get(public_routes.lock_screen, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Lock Screen",
    layout: index_without_nav,
    page_path: "lock-screen",
  });
});
route.get(public_routes.two_step_verification, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Two Step Verification",
    layout: index_without_nav,
    page_path: "two-step-verification",
  });
});
route.get(public_routes.two_step_verification_2, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Two Step Verification 2",
    layout: index_without_nav,
    page_path: "two-step-verification-2",
  });
});
route.get(public_routes.two_step_verification_3, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Two Step Verification 3",
    layout: index_without_nav,
    page_path: "two-step-verification-3",
  });
});
route.get(public_routes.reset_password_success, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Two Step Verification 3",
    layout: index_without_nav,
    page_path: "reset-password-success",
  });
});
route.get(public_routes.reset_password_success_2, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Two Step Verification 3",
    layout: index_without_nav,
    page_path: "reset-password-success-2",
  });
});
route.get(public_routes.reset_password_success_3, (req, res, next) => {
  res.render(index_without_nav, {
    title: "Two Step Verification 3",
    layout: index_without_nav,
    page_path: "reset-password-success-3",
  });
});

// --------------- ( Main ) ----------------------

route.get(public_routes.admin_dashboard, (req, res, next) => {
  res.render(index, {
    page_path: "dashboard/admin-dashboard",
    title: "Dashboard",
  });
});

route.get(public_routes.teacher_dashboard, (req, res, next) => {
  res.render(index, {
    page_path: "dashboard/teacher-dashboard",
    title: "Dashboard",
  });
});

route.get(public_routes.student_dashboard, (req, res, next) => {
  res.render(index, {
    page_path: "dashboard/student-dashboard",
    title: "Dashboard",
  });
});



route.get(public_routes.parent_dashboard, (req, res, next) => {
  res.render(index, {
    page_path: "dashboard/parent-dashboard",
    title: "Dashboard",
  });
});


route.get(public_routes.activities, (req, res, next) => {
  res.render(index, {
    page_path: "activities",
    title: "Dashboard",
  });
});

// ---------------- ( Pages ) ---------------------

route.get(public_routes.blank_page, (req, res, next) => {
  res.render(index, {
    title: "Blank page - Preskool admin template",
    page_path: "/page/blank-page",
  });
});

route.get(public_routes.pageNotFount, (req, res, next) => {
  res.render(index_error, {
    title: "Error 404",
    page_path: "404-error",
    layout: index_error,
  });
});
route.get(public_routes.serverError, (req, res, next) => {
  res.render(index_error, {
    title: "Error 500",
    page_path: "500-error",
    layout: index_error,
  });
});
route.get(public_routes.under_maintenance, (req, res, next) => {
  res.render(index_error, {
    title: "Under Maintenance",
    page_path: "under-maintenance",
    layout: index_error,
  });
});

// --------------- ( Advanced UI) ----------------

route.get(public_routes.ui_ribbon, (req, res, next) => {
  res.render(index, {
    title: "Elements - Preskool admin template",
    page_path: "elements/ui-ribbon",
  });
});

route.get(public_routes.ui_clipboard, (req, res, next) => {
  res.render(index, {
    title: "Elements - Preskool admin template",
    page_path: "elements/ui-clipboard",
  });
});

route.get(public_routes.ui_drag_drop, (req, res, next) => {
  res.render(index, {
    title: "Elements - Preskool admin template",
    page_path: "elements/ui-drag-drop",
  });
});

route.get(public_routes.ui_rating, (req, res, next) => {
  res.render(index, {
    title: "Elements - Preskool admin template",
    page_path: "elements/ui-rating",
  });
});

route.get(public_routes.ui_text_editor, (req, res, next) => {
  res.render(index, {
    title: "Elements - Preskool admin template",
    page_path: "elements/ui-text-editor",
  });
});

route.get(public_routes.ui_counter, (req, res, next) => {
  res.render(index, {
    title: "Elements - Preskool admin template",
    page_path: "elements/ui-counter",
  });
});

route.get(public_routes.ui_scrollbar, (req, res, next) => {
  res.render(index, {
    title: "Elements - Preskool admin template",
    page_path: "elements/ui-scrollbar",
  });
});

route.get(public_routes.ui_stickynote, (req, res, next) => {
  res.render(index, {
    title: "Elements - Preskool admin template",
    page_path: "elements/ui-stickynote",
  });
});

route.get(public_routes.ui_timeline, (req, res, next) => {
  res.render(index, {
    title: "Elements - Preskool admin template",
    page_path: "elements/ui-timeline",
  });
});

route.get(public_routes.ui_rangeslider, (req, res, next) => {
  res.render(index, {
    page_path: "elements/ui-rangeslider",
    title: "Elements - Preskool admin template",
  });
});

// ---------------- ( charts ) --------------------------

route.get(public_routes.chart_apex, (req, res, next) => {
  res.render(index, {
    title: "Charts - Preskool admin template",
    page_path: "charts/chart-apex",
  });
});

route.get(public_routes.chart_js, (req, res, next) => {
  res.render(index, {
    title: "Charts - Preskool admin template",
    page_path: "charts/chart-js",
  });
});

route.get(public_routes.chart_morris, (req, res, next) => {
  res.render(index, {
    title: "Charts - Preskool admin template",
    page_path: "charts/chart-morris",
  });
});

route.get(public_routes.chart_flot, (req, res, next) => {
  res.render(index, {
    title: "Charts - Preskool admin template",
    page_path: "charts/chart-flot",
  });
});

route.get(public_routes.chart_peity, (req, res, next) => {
  res.render(index, {
    title: "Charts - Preskool admin template",
    page_path: "charts/chart-peity",
  });
});

route.get(public_routes.chart_c3, (req, res, next) => {
  res.render(index, {
    title: "Charts - Preskool admin template",
    page_path: "charts/chart-c3",
  });
});

// -------------- ( Icons ) --------------

route.get(public_routes.icon_fontawesome, (req, res, next) => {
  res.render(index, {
    title: "Icons - Preskool admin template",
    page_path: "icons/icon-fontawesome",
  });
});

route.get(public_routes.icon_feather, (req, res, next) => {
  res.render(index, {
    title: "Icons - Preskool admin template",
    page_path: "icons/icon-feather",
  });
});

route.get(public_routes.icon_ionic, (req, res, next) => {
  res.render(index, {
    title: "Icons - Preskool admin template",
    page_path: "icons/icon-ionic",
  });
});

route.get(public_routes.icon_material, (req, res, next) => {
  res.render(index, {
    title: "Icons - Preskool admin template",
    page_path: "icons/icon-material",
  });
});

route.get(public_routes.icon_pe7, (req, res, next) => {
  res.render(index, {
    title: "Icons - Preskool admin template",
    page_path: "icons/icon-pe7",
  });
});

route.get(public_routes.icon_simpleline, (req, res, next) => {
  res.render(index, {
    title: "Icons - Preskool admin template",
    page_path: "icons/icon-simpleline",
  });
});

route.get(public_routes.icon_themify, (req, res, next) => {
  res.render(index, {
    title: "Icons - Preskool admin template",
    page_path: "icons/icon-themify",
  });
});

route.get(public_routes.icon_weather, (req, res, next) => {
  res.render(index, {
    title: "Icons - Preskool admin template",
    page_path: "icons/icon-weather",
  });
});

route.get(public_routes.icon_typicon, (req, res, next) => {
  res.render(index, {
    title: "Icons - Preskool admin template",
    page_path: "icons/icon-typicon",
  });
});

route.get(public_routes.icon_flag, (req, res, next) => {
  res.render(index, {
    title: "Icons - Preskool admin template",
    page_path: "icons/icon-flag",
  });
});

// ------------- ( Forms ) ----------------

route.get(public_routes.form_basic_inputs, (req, res, next) => {
  res.render(index, {
    title: "Forms - Preskool admin template",
    page_path: "forms/form-basic-inputs",
  });
});

route.get(public_routes.form_input_groups, (req, res, next) => {
  res.render(index, {
    title: "Forms - Preskool admin template",
    page_path: "forms/form-input-groups",
  });
});

route.get(public_routes.form_horizontal, (req, res, next) => {
  res.render(index, {
    title: "Forms - Preskool admin template",
    page_path: "forms/form-horizontal",
  });
});

route.get(public_routes.form_vertical, (req, res, next) => {
  res.render(index, {
    title: "Forms - Preskool admin template",
    page_path: "forms/form-vertical",
  });
});

route.get(public_routes.form_mask, (req, res, next) => {
  res.render(index, {
    title: "Forms - Preskool admin template",
    page_path: "forms/form-mask",
  });
});

route.get(public_routes.form_validation, (req, res, next) => {
  res.render(index, {
    title: "Forms - Preskool admin template",
    page_path: "forms/form-validation",
  });
});

route.get(public_routes.form_checkbox_radios, (req, res, next) => {
  res.render(index, {
    title: "Forms - Preskool admin template",
    page_path: "forms/form-checkbox-radios",
  });
});
route.get(public_routes.form_grid_gutters, (req, res, next) => {
  res.render(index, {
    title: "Forms - Preskool admin template",
    page_path: "forms/form-grid-gutters",
  });
});
route.get(public_routes.form_select, (req, res, next) => {
  res.render(index, {
    title: "Forms - Preskool admin template",
    page_path: "forms/form-select",
  });
});
route.get(public_routes.form_fileUpload, (req, res, next) => {
  res.render(index, {
    title: "Forms - Preskool admin template",
    page_path: "forms/form-fileupload",
  });
});
route.get(public_routes.form_elements, (req, res, next) => {
  res.render(index, {
    title: "Forms - Preskool admin template",
    page_path: "forms/form-elements",
  });
});
route.get(public_routes.form_floating_labels, (req, res, next) => {
  res.render(index, {
    title: "Forms - Preskool admin template",
    page_path: "forms/form-floating-labels",
  });
});
route.get(public_routes.form_formSelected2, (req, res, next) => {
  res.render(index, {
    title: "Forms - Preskool admin template",
    page_path: "forms/form-select2",
  });
});
route.get(public_routes.form_wizard, (req, res, next) => {
  res.render(index, {
    title: "Forms - Preskool admin template",
    page_path: "forms/form-wizard",
  });
});

// -------------- ( Tables ) ----------------------

route.get(public_routes.tables_basic, (req, res, next) => {
  res.render(index, {
    title: "Tables - Preskool admin template",
    page_path: "tables/tables-basic",
  });
});

route.get(public_routes.data_tables, (req, res, next) => {
  res.render(index, {
    title: "Tables - Preskool admin template",
    page_path: "tables/data-tables",
  });
});

route.get(public_routes.profile, (req, res, next) => {
  res.render(index, {
    title: "Employee Profile - Preskool admin template",
    page_path: "profile/profile",
  });
});

// ---------------- ( Application ) ---------------------

route.get(public_routes.application_chat, (req, res, next) => {
  res.render(index, {
    page_path: "application/chat",
    title: "Chat",
  });
});
route.get(public_routes.application_call, (req, res, next) => {
  res.render(index, {
    page_path: "application/call",
    title: "Call",
  });
});
route.get(public_routes.video_call, (req, res, next) => {
  res.render(index, {
    page_path: "application/video-call",
    title: "Video Call",
  });
});

route.get(public_routes.file_manager, (req, res, next) => {
  res.render(index, {
    page_path: "application/file-manager",
    title: "File-manager",
  });
});

route.get(public_routes.notes, (req, res, next) => {
  res.render(index, {
    page_path: "application/notes",
    title: "Notes",
  });
});
route.get(public_routes.todo, (req, res, next) => {
  res.render(index, {
    page_path: "application/todo",
    title: "todo",
  });
});

//Calendar

route.get(public_routes.application_calendar, (req, res, next) => {
  res.render(index, {
    page_path: "application/calendar",
    title: "Calendar",
  });
});

route.get(public_routes.call_history, (req, res, next) => {
  res.render(index, {
    page_path: "application/call-history",
    title: "Calendar",
  });
});

//Email

route.get(public_routes.application_email, (req, res, next) => {
  res.render(index, {
    page_path: "application/email",
    title: "Email",
  });
});

// ---------------- ( Base UI ) ---------------------

route.get(public_routes.ui_carousel, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-carousel",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_cards, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-cards",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_breadcrumb, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-breadcrumb",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_buttons_group, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-buttons-group",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_buttons, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-buttons",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_borders, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-borders",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_badges, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-badges",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_avatar, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-avatar",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_accordion, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-accordion",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_alerts, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-alerts",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_colors, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-colors",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_popovers, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-popovers",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_pagination, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-pagination",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_offcanvas, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-offcanvas",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_modals, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-modals",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_media, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-media",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_lightbox, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-lightbox",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_images, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-images",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_grid, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-grid",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_dropdowns, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-dropdowns",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_progress, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-progress",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_video, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-video",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_typography, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-typography",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_tooltips, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-tooltips",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_toasts, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-toasts",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_nav_tabs, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-nav-tabs",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_sweetalerts, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-sweetalerts",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_spinner, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-spinner",
    title: "Base-UI",
  });
});

route.get(public_routes.ui_placeholders, (req, res, next) => {
  res.render(index, {
    page_path: "base-ui/ui-placeholders",
    title: "Base-UI",
  });
});

// ---------------- ( Settings ) ---------------------

route.get(public_routes.storage, (req, res, next) => {
  res.render(index, {
    page_path: "settings/storage",
    title: "Settings",
  });
});

route.get(public_routes.ban_ip_address, (req, res, next) => {
  res.render(index, {
    page_path: "settings/ban-ip-address",
    title: "Settings",
  });
});

route.get(public_routes.school_settings, (req, res, next) => {
  res.render(index, {
    page_path: "settings/school-settings",
    title: "Settings",
  });
});

route.get(public_routes.religion, (req, res, next) => {
  res.render(index, {
    page_path: "settings/religion",
    title: "Settings",
  });
});

route.get(public_routes.payment_gateways, (req, res, next) => {
  res.render(index, {
    page_path: "settings/payment-gateways",
    title: "Settings",
  });
});

route.get(public_routes.tax_rates, (req, res, next) => {
  res.render(index, {
    page_path: "settings/tax-rates",
    title: "Settings",
  });
});

route.get(public_routes.email_settings, (req, res, next) => {
  res.render(index, {
    page_path: "settings/email-settings",
    title: "Settings",
  });
});

route.get(public_routes.email_templates, (req, res, next) => {
  res.render(index, {
    page_path: "settings/email-templates",
    title: "Settings",
  });
});

route.get(public_routes.sms_settings, (req, res, next) => {
  res.render(index, {
    page_path: "settings/sms-settings",
    title: "Settings",
  });
});

route.get(public_routes.otp_settings, (req, res, next) => {
  res.render(index, {
    page_path: "settings/otp-settings",
    title: "Settings",
  });
});

route.get(public_routes.gdpr_cookies, (req, res, next) => {
  res.render(index, {
    page_path: "settings/gdpr-cookies",
    title: "Settings",
  });
});

route.get(public_routes.invoice_settings, (req, res, next) => {
  res.render(index, {
    page_path: "settings/invoice-settings",
    title: "Settings",
  });
});

route.get(public_routes.custom_fields, (req, res, next) => {
  res.render(index, {
    page_path: "settings/custom-fields",
    title: "Settings",
  });
});

route.get(public_routes.company_settings, (req, res, next) => {
  res.render(index, {
    page_path: "settings/company-settings",
    title: "Settings",
  });
});

route.get(public_routes.localization, (req, res, next) => {
  res.render(index, {
    page_path: "settings/localization",
    title: "Settings",
  });
});

route.get(public_routes.prefixes, (req, res, next) => {
  res.render(index, {
    page_path: "settings/prefixes",
    title: "Settings",
  });
});

route.get(public_routes.preferences, (req, res, next) => {
  res.render(index, {
    page_path: "settings/preferences",
    title: "Settings",
  });
});

route.get(public_routes.social_authentication, (req, res, next) => {
  res.render(index, {
    page_path: "settings/social-authentication",
    title: "Settings",
  });
});

route.get(public_routes.language, (req, res, next) => {
  res.render(index, {
    page_path: "settings/language",
    title: "Settings",
  });
});

route.get(public_routes.profile_settings, (req, res, next) => {
  res.render(index, {
    page_path: "settings/profile-settings",
    title: "Settings",
  });
});

route.get(public_routes.security_settings, (req, res, next) => {
  res.render(index, {
    page_path: "settings/security-settings",
    title: "Settings",
  });
});

route.get(public_routes.notifications_settings, (req, res, next) => {
  res.render(index, {
    page_path: "settings/notifications-settings",
    title: "Settings",
  });
});

route.get(public_routes.connected_apps, (req, res, next) => {
  res.render(index, {
    page_path: "settings/connected-apps",
    title: "Settings",
  });
});

// ---------------- ( Support ) ---------------------

route.get(public_routes.tickets, (req, res, next) => {
  res.render(index, {
    page_path: "support/tickets",
    title: "Tickets",
  });
});

route.get(public_routes.ticket_details, (req, res, next) => {
  res.render(index, {
    page_path: "support/ticket-details",
    title: "Tickets",
  });
});

route.get(public_routes.ticket_grid, (req, res, next) => {
  res.render(index, {
    page_path: "support/ticket-grid",
    title: "Tickets",
  });
});

route.get(public_routes.contact_messages, (req, res, next) => {
  res.render(index, {
    page_path: "support/contact-messages",
    title: "Contact Messages",
  });
});

// ---------------- ( Support ) ---------------------

route.get(public_routes.students, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/students/students",
    title: "Peoples",
  });
});

route.get(public_routes.add_student, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/students/add-student",
    title: "Peoples",
  });
});

route.get(public_routes.edit_student, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/students/edit-student",
    title: "Peoples",
  });
});

route.get(public_routes.student_grid, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/students/student-grid",
    title: "Peoples",
  });
});

route.get(public_routes.student_details, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/students/student-details",
    title: "Peoples",
  });
});

route.get(public_routes.student_time_table, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/students/student-time-table",
    title: "Peoples",
  });
});

route.get(public_routes.student_leaves, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/students/student-leaves",
    title: "Peoples",
  });
});

route.get(public_routes.student_fees, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/students/student-fees",
    title: "Peoples",
  });
});

route.get(public_routes.student_result, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/students/student-result",
    title: "Peoples",
  });
});

route.get(public_routes.student_library, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/students/student-library",
    title: "Peoples",
  });
});

route.get(public_routes.student_promotion, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/students/student-promotion",
    title: "Peoples",
  });
});

route.get(public_routes.parents, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/parents/parents",
    title: "Peoples",
  });
});

route.get(public_routes.parent_grid, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/parents/parent-grid",
    title: "Peoples",
  });
});

route.get(public_routes.guardians, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/guardians/guardians",
    title: "Peoples",
  });
});

route.get(public_routes.guardian_grid, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/guardians/guardian-grid",
    title: "Peoples",
  });
});

route.get(public_routes.teachers, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/teachers/teachers",
    title: "Peoples",
  });
});

route.get(public_routes.teacher_grid, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/teachers/teacher-grid",
    title: "Peoples",
  });
});

route.get(public_routes.add_teacher, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/teachers/add-teacher",
    title: "Peoples",
  });
});

route.get(public_routes.edit_teacher, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/teachers/edit-teacher",
    title: "Peoples",
  });
});

route.get(public_routes.teacher_details, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/teachers/teacher-details",
    title: "Peoples",
  });
});

route.get(public_routes.routine_teachers, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/teachers/routine-teachers",
    title: "Peoples",
  });
});

route.get(public_routes.teacher_leaves, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/teachers/teacher-leaves",
    title: "Peoples",
  });
});

route.get(public_routes.teacher_salary, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/teachers/teacher-salary",
    title: "Peoples",
  });
});

route.get(public_routes.teacher_library, (req, res, next) => {
  res.render(index, {
    page_path: "peoples/teachers/teacher-library",
    title: "Peoples",
  });
});

// ---------------- ( Content ) ---------------------

route.get(public_routes.faq, (req, res, next) => {
  res.render(index, {
    page_path: "content/faq",
    title: "Content",
  });
});

route.get(public_routes.testimonials, (req, res, next) => {
  res.render(index, {
    page_path: "content/testimonials",
    title: "Content",
  });
});

route.get(public_routes.pages, (req, res, next) => {
  res.render(index, {
    page_path: "content/pages",
    title: "Content",
  });
});

route.get(public_routes.countries, (req, res, next) => {
  res.render(index, {
    page_path: "content/location/countries",
    title: "Content",
  });
});

route.get(public_routes.states, (req, res, next) => {
  res.render(index, {
    page_path: "content/location/states",
    title: "Content",
  });
});

route.get(public_routes.cities, (req, res, next) => {
  res.render(index, {
    page_path: "content/location/cities",
    title: "Content",
  });
});

route.get(public_routes.blog, (req, res, next) => {
  res.render(index, {
    page_path: "content/blog/blog",
    title: "Content",
  });
});

route.get(public_routes.blog_categories, (req, res, next) => {
  res.render(index, {
    page_path: "content/blog/blog-categories",
    title: "Content",
  });
});

route.get(public_routes.blog_comments, (req, res, next) => {
  res.render(index, {
    page_path: "content/blog/blog-comments",
    title: "Content",
  });
});

route.get(public_routes.blog_tags, (req, res, next) => {
  res.render(index, {
    page_path: "content/blog/blog-tags",
    title: "Content",
  });
});

// ---------------- ( Academic ) ---------------------

route.get(public_routes.classes, (req, res, next) => {
  res.render(index, {
    page_path: "academic/classes/classes",
    title: "Academic",
  });
});

route.get(public_routes.schedule_classes, (req, res, next) => {
  res.render(index, {
    page_path: "academic/classes/schedule-classes",
    title: "Academic",
  });
});

route.get(public_routes.class_room, (req, res, next) => {
  res.render(index, {
    page_path: "academic/class-room",
    title: "Academic",
  });
});

route.get(public_routes.class_routine, (req, res, next) => {
  res.render(index, {
    page_path: "academic/class-routine",
    title: "Academic",
  });
});

route.get(public_routes.class_section, (req, res, next) => {
  res.render(index, {
    page_path: "academic/class-section",
    title: "Academic",
  });
});

route.get(public_routes.class_subject, (req, res, next) => {
  res.render(index, {
    page_path: "academic/class-subject",
    title: "Academic",
  });
});

route.get(public_routes.class_syllabus, (req, res, next) => {
  res.render(index, {
    page_path: "academic/class-syllabus",
    title: "Academic",
  });
});

route.get(public_routes.class_time_table, (req, res, next) => {
  res.render(index, {
    page_path: "academic/class-time-table",
    title: "Academic",
  });
});

route.get(public_routes.class_home_work, (req, res, next) => {
  res.render(index, {
    page_path: "academic/class-home-work",
    title: "Academic",
  });
});

route.get(public_routes.exam, (req, res, next) => {
  res.render(index, {
    page_path: "academic/examinations/exam",
    title: "Academic",
  });
});

route.get(public_routes.exam_schedule, (req, res, next) => {
  res.render(index, {
    page_path: "academic/examinations/exam-schedule",
    title: "Academic",
  });
});

route.get(public_routes.grade, (req, res, next) => {
  res.render(index, {
    page_path: "academic/examinations/grade",
    title: "Academic",
  });
});

route.get(public_routes.exam_attendance, (req, res, next) => {
  res.render(index, {
    page_path: "academic/examinations/exam-attendance",
    title: "Academic",
  });
});

route.get(public_routes.exam_results, (req, res, next) => {
  res.render(index, {
    page_path: "academic/examinations/exam-results",
    title: "Academic",
  });
});

route.get(public_routes.exam_results, (req, res, next) => {
  res.render(index, {
    page_path: "academic/examinations/exam-results",
    title: "Academic",
  });
});

route.get(public_routes.academic_reasons, (req, res, next) => {
  res.render(index, {
    page_path: "academic/academic-reasons",
    title: "Academic",
  });
});

// ---------------- ( Management ) ---------------------

route.get(public_routes.fees_group, (req, res, next) => {
  res.render(index, {
    page_path: "management/fees-collection/fees-group",
    title: "Management",
  });
});

route.get(public_routes.fees_type, (req, res, next) => {
  res.render(index, {
    page_path: "management/fees-collection/fees-type",
    title: "Management",
  });
});

route.get(public_routes.fees_master, (req, res, next) => {
  res.render(index, {
    page_path: "management/fees-collection/fees-master",
    title: "Management",
  });
});

route.get(public_routes.fees_assign, (req, res, next) => {
  res.render(index, {
    page_path: "management/fees-collection/fees-assign",
    title: "Management",
  });
});

route.get(public_routes.collect_fees, (req, res, next) => {
  res.render(index, {
    page_path: "management/fees-collection/collect-fees",
    title: "Management",
  });
});
route.get(public_routes.library_members, (req, res, next) => {
  res.render(index, {
    page_path: "management/library/library-members",
    title: "Management",
  });
});

route.get(public_routes.library_books, (req, res, next) => {
  res.render(index, {
    page_path: "management/library/library-books",
    title: "Management",
  });
});

route.get(public_routes.library_issue_book, (req, res, next) => {
  res.render(index, {
    page_path: "management/library/library-issue-book",
    title: "Management",
  });
});

route.get(public_routes.library_return, (req, res, next) => {
  res.render(index, {
    page_path: "management/library/library-return",
    title: "Management",
  });
});

route.get(public_routes.sports, (req, res, next) => {
  res.render(index, {
    page_path: "management/sports",
    title: "Management",
  });
});

route.get(public_routes.players, (req, res, next) => {
  res.render(index, {
    page_path: "management/players",
    title: "Management",
  });
});

route.get(public_routes.hostel_list, (req, res, next) => {
  res.render(index, {
    page_path: "management/hostel/hostel-list",
    title: "Management",
  });
});

route.get(public_routes.hostel_rooms, (req, res, next) => {
  res.render(index, {
    page_path: "management/hostel/hostel-rooms",
    title: "Management",
  });
});


route.get(public_routes.hostel_room_type, (req, res, next) => {
  res.render(index, {
    page_path: "management/hostel/hostel-room-type",
    title: "Management",
  });
});

route.get(public_routes.transport_routes, (req, res, next) => {
  res.render(index, {
    page_path: "management/transport/transport-routes",
    title: "Management",
  });
});

route.get(public_routes.transport_pickup_points, (req, res, next) => {
  res.render(index, {
    page_path: "management/transport/transport-pickup-points",
    title: "Management",
  });
});

route.get(public_routes.transport_vehicle_drivers, (req, res, next) => {
  res.render(index, {
    page_path: "management/transport/transport-vehicle-drivers",
    title: "Management",
  });
});

route.get(public_routes.transport_vehicle, (req, res, next) => {
  res.render(index, {
    page_path: "management/transport/transport-vehicle",
    title: "Management",
  });
});

route.get(public_routes.transport_assign_vehicle, (req, res, next) => {
  res.render(index, {
    page_path: "management/transport/transport-assign-vehicle",
    title: "Management",
  });
});

// ---------------- ( HRM ) ---------------------

route.get(public_routes.staffs, (req, res, next) => {
  res.render(index, {
    page_path: "hrm/staffs",
    title: "HRM",
  });
});

route.get(public_routes.departments, (req, res, next) => {
  res.render(index, {
    page_path: "hrm/departments",
    title: "HRM",
  });
});

route.get(public_routes.designation, (req, res, next) => {
  res.render(index, {
    page_path: "hrm/designation",
    title: "HRM",
  });
});

route.get(public_routes.student_attendance, (req, res, next) => {
  res.render(index, {
    page_path: "hrm/attendance/student-attendance",
    title: "HRM",
  });
});

route.get(public_routes.teacher_attendance, (req, res, next) => {
  res.render(index, {
    page_path: "hrm/attendance/teacher-attendance",
    title: "HRM",
  });
});

route.get(public_routes.staff_attendance, (req, res, next) => {
  res.render(index, {
    page_path: "hrm/attendance/staff-attendance",
    title: "HRM",
  });
});

route.get(public_routes.list_leaves, (req, res, next) => {
  res.render(index, {
    page_path: "hrm/leaves/list-leaves",
    title: "HRM",
  });
});

route.get(public_routes.approve_request, (req, res, next) => {
  res.render(index, {
    page_path: "hrm/leaves/approve-request",
    title: "HRM",
  });
});

route.get(public_routes.holidays, (req, res, next) => {
  res.render(index, {
    page_path: "hrm/holidays",
    title: "HRM",
  });
});

route.get(public_routes.payroll, (req, res, next) => {
  res.render(index, {
    page_path: "hrm/payroll",
    title: "HRM",
  });
});

route.get(public_routes.add_staff, (req, res, next) => {
  res.render(index, {
    page_path: "hrm/add-staff",
    title: "HRM",
  });
});

route.get(public_routes.edit_staff, (req, res, next) => {
  res.render(index, {
    page_path: "hrm/edit-staff",
    title: "HRM",
  });
});

route.get(public_routes.staff_details, (req, res, next) => {
  res.render(index, {
    page_path: "hrm/staff-details",
    title: "HRM",
  });
});

route.get(public_routes.staff_payroll, (req, res, next) => {
  res.render(index, {
    page_path: "hrm/staff-payroll",
    title: "HRM",
  });
});

route.get(public_routes.staff_leaves, (req, res, next) => {
  res.render(index, {
    page_path: "hrm/staff-leaves",
    title: "HRM",
  });
});

route.get(public_routes.staffs_attendance, (req, res, next) => {
  res.render(index, {
    page_path: "hrm/staffs-attendance",
    title: "HRM",
  });
});

// ---------------- ( Finance & Accounts ) ---------------------

route.get(public_routes.expenses, (req, res, next) => {
  res.render(index, {
    page_path: "finance-accounts/expenses",
    title: "Finance & Accounts",
  });
});

route.get(public_routes.expenses_category, (req, res, next) => {
  res.render(index, {
    page_path: "finance-accounts/expenses-category",
    title: "Finance & Accounts",
  });
});

route.get(public_routes.accounts_income, (req, res, next) => {
  res.render(index, {
    page_path: "finance-accounts/accounts-income",
    title: "Finance & Accounts",
  });
});

route.get(public_routes.accounts_invoices, (req, res, next) => {
  res.render(index, {
    page_path: "finance-accounts/accounts-invoices",
    title: "Finance & Accounts",
  });
});

route.get(public_routes.add_invoice, (req, res, next) => {
  res.render(index, {
    page_path: "finance-accounts/add-invoice",
    title: "Finance & Accounts",
  });
});

route.get(public_routes.edit_invoice, (req, res, next) => {
  res.render(index, {
    page_path: "finance-accounts/edit-invoice",
    title: "Finance & Accounts",
  });
});

route.get(public_routes.invoice, (req, res, next) => {
  res.render(index, {
    page_path: "finance-accounts/invoice",
    title: "Finance & Accounts",
  });
});

route.get(public_routes.accounts_transactions, (req, res, next) => {
  res.render(index, {
    page_path: "finance-accounts/accounts-transactions",
    title: "Finance & Accounts",
  });
});

// ---------------- ( Announcements ) ---------------------

route.get(public_routes.notice_board, (req, res, next) => {
  res.render(index, {
    page_path: "announcements/notice-board",
    title: "Finance & Accounts",
  });
});

route.get(public_routes.events, (req, res, next) => {
  res.render(index, {
    page_path: "announcements/events",
    title: "Finance & Accounts",
  });
});

// ---------------- ( Reports ) ---------------------

route.get(public_routes.attendance_report, (req, res, next) => {
  res.render(index, {
    page_path: "reports/attendance-report",
    title: "Reports",
  });
});

route.get(public_routes.student_attendance_type, (req, res, next) => {
  res.render(index, {
    page_path: "reports/student-attendance-type",
    title: "Reports",
  });
});

route.get(public_routes.daily_attendance, (req, res, next) => {
  res.render(index, {
    page_path: "reports/daily-attendance",
    title: "Reports",
  });
});

route.get(public_routes.student_day_wise, (req, res, next) => {
  res.render(index, {
    page_path: "reports/student-day-wise",
    title: "Reports",
  });
});

route.get(public_routes.teacher_day_wise, (req, res, next) => {
  res.render(index, {
    page_path: "reports/teacher-day-wise",
    title: "Reports",
  });
});

route.get(public_routes.teacher_report, (req, res, next) => {
  res.render(index, {
    page_path: "reports/teacher-report",
    title: "Reports",
  });
});

route.get(public_routes.staff_day_wise, (req, res, next) => {
  res.render(index, {
    page_path: "reports/staff-day-wise",
    title: "Reports",
  });
});

route.get(public_routes.staff_report, (req, res, next) => {
  res.render(index, {
    page_path: "reports/staff-report",
    title: "Reports",
  });
});

route.get(public_routes.class_report, (req, res, next) => {
  res.render(index, {
    page_path: "reports/class-report",
    title: "Reports",
  });
});

route.get(public_routes.student_report, (req, res, next) => {
  res.render(index, {
    page_path: "reports/student-report",
    title: "Reports",
  });
});

route.get(public_routes.grade_report, (req, res, next) => {
  res.render(index, {
    page_path: "reports/grade-report",
    title: "Reports",
  });
});

route.get(public_routes.fees_report, (req, res, next) => {
  res.render(index, {
    page_path: "reports/fees-report",
    title: "Reports"
  });
});

route.get(public_routes.leave_report, (req, res, next) =>  {
  res.render(index, {
    page_path : "reports/leave-report",
    title : "Report"
  });
});

// ---------------- ( Layouts ) ---------------------

route.get(public_routes.layout_default, (req, res, next) => {
  res.render(index, {
    page_path: "layout-settings/layout-default",
    title: "Layouts",
  });
});

route.get(public_routes.layout_mini, (req, res, next) => {
  res.render(index, {
    page_path: "layout-settings/layout-mini",
    title: "Layouts"
  });
});

route.get(public_routes.layout_dark, (req, res, next) => {
  res.render(index, {
    page_path: "layout-settings/layout-dark",
    title: "Layouts"
  });
});

route.get(public_routes.layout_box, (req, res, next) => {
  res.render(index, {
    page_path: "layout-settings/layout-box",
    title: "Layouts"
  });
});

route.get(public_routes.layout_rtl, (req, res, next) => {
  res.render(index, {
    page_path: "layout-settings/layout-rtl",
    title: "Layouts"
  });
});

// ---------------- ( User Management ) ---------------------

route.get(public_routes.users, (req, res, next) => {
  res.render(index, {
    page_path: "user-management/users",
    title: "User Management",
  });
});

route.get(public_routes.roles_permission, (req, res, next) => {
  res.render(index, {
    page_path: "user-management/roles-permission",
    title: "User Management",
  });
});

route.get(public_routes.permission, (req, res, next) => {
  res.render(index, {
    page_path: "user-management/permission",
    title: "User Management",
  });
});

route.get(public_routes.delete_account, (req, res, next) => {
  res.render(index, {
    page_path: "user-management/delete-account",
    title: "User Management",
  });
});

// ---------------- ( Membership ) ---------------------

route.get(public_routes.membership_addons, (req, res, next) => {
  res.render(index, {
    page_path: "membership/membership-addons",
    title: "Membership",
  });
});

route.get(public_routes.membership_plans, (req, res, next) => {
  res.render(index, {
    page_path: "membership/membership-plans",
    title: "Membership",
  });
});

route.get(public_routes.membership_transactions, (req, res, next) => {
  res.render(index, {
    page_path: "membership/membership-transactions",
    title: "Membership",
  });
});

route.get("/", function (req, res) {
  res.redirect(public_routes.login);
});
route.get("*", function (req, res) {
  res.redirect(public_routes.pageNotFount);
});


module.exports = route