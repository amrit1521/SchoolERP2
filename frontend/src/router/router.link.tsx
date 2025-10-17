import { Navigate, Route } from "react-router";
import { all_routes } from "./all_routes.tsx";
import Login from "../auth/login/login";
// import Register from "../auth/register/register";
// import TwoStepVerification from "../auth/twoStepVerification/twoStepVerification";
// import EmailVerification from "../auth/emailVerification/emailVerification";
import ResetPassword from "../auth/resetPassword/resetPassword";
import ForgotPassword from "../auth/forgotPassword/forgotPassword";
// import Login2 from "../auth/login/login-2";
// import Login3 from "../auth/login/login-3";
// import ResetPassword2 from "../auth/resetPassword/resetPassword-2";
// import ResetPassword3 from "../auth/resetPassword/resetPassword-3";
// import TwoStepVerification2 from "../auth/twoStepVerification/twoStepVerification-2";
// import TwoStepVerification3 from "../auth/twoStepVerification/twoStepVerification-3";
// import Register2 from "../auth/register/register-2";
// import Register3 from "../auth/register/register-3";
// import ForgotPassword2 from "../auth/forgotPassword/forgotPassword-2";
// import ForgotPassword3 from "../auth/forgotPassword/forgotPassword-3";
import ResetPasswordSuccess from "../auth/resetPasswordSuccess/resetPasswordSuccess";
// import ResetPasswordSuccess2 from "../auth/resetPasswordSuccess/resetPasswordSuccess-2";
// import ResetPasswordSuccess3 from "../auth/resetPasswordSuccess/resetPasswordSuccess-3";
// import LockScreen from "../auth/lockScreen";
// import EmailVerification2 from "../auth/emailVerification/emailVerification-2";
// import EmailVerification3 from "../auth/emailVerification/emailVerification-3";
import AdminDashboard from "../admin/mainMenu/adminDashboard";
import ParentDashboard from "../admin/mainMenu/parentDashboard";
import TeacherDashboard from "../admin/mainMenu/teacherDashboard";
import StudentDasboard from "../admin/mainMenu/studentDashboard";
import AudioCall from "../admin/application/call/audioCall";
import CallHistory from "../admin/application/call/callHistory";
import Videocall from "../admin/application/call/videoCall";
import Chat from "../admin/application/chat";
import Email from "../admin/application/email";
import FileManager from "../admin/application/fileManager";
import Todo from "../admin/application/todo";
import Calendar from "../admin/mainMenu/apps/calendar";
import Notes from "../admin/application/notes";
import Error404 from "../admin/pages/error/error-404";
import Error500 from "../admin/pages/error/error-500";
import Ribbon from "antd/es/badge/Ribbon";
import AcademicReason from "../admin/academic/academic-reason";
import ClassHomeWork from "../admin/academic/class-home-work";
import ClassRoom from "../admin/academic/class-room";
import ClassRoutine from "../admin/academic/class-routine";
import ClassSection from "../admin/academic/class-section";
import ClassSubject from "../admin/academic/class-subject";
import ClassSyllabus from "../admin/academic/class-syllabus";
import ClassTimetable from "../admin/academic/class-timetable";
import Classes from "../admin/academic/classes";
import Exam from "../admin/academic/examinations/exam";
import ExamAttendance from "../admin/academic/examinations/exam-attendance";
import ExamResult from "../admin/academic/examinations/exam-results";
import ExamSchedule from "../admin/academic/examinations/exam-schedule";
import Grade from "../admin/academic/examinations/grade";
import ScheduleClasses from "../admin/academic/schedule-classes";
import AccountsIncome from "../admin/accounts/accounts-income";
import AccountsInvoices from "../admin/accounts/accounts-invoices";
import AccountsTransactions from "../admin/accounts/accounts-transactions";
import AddInvoice from "../admin/accounts/add-invoice";
import EditInvoice from "../admin/accounts/edit-invoice";
import Expense from "../admin/accounts/expense";
import ExpensesCategory from "../admin/accounts/expenses-category";
import Invoice from "../admin/accounts/invoice";
import Events from "../admin/announcements/events";
import NoticeBoard from "../admin/announcements/notice-board";
import AllBlogs from "../admin/content/blog/allBlogs";
import BlogCategories from "../admin/content/blog/blogCategories";
import BlogComments from "../admin/content/blog/blogComments";
import BlogTags from "../admin/content/blog/blogTags";
import Faq from "../admin/content/faq";
import Cities from "../admin/content/location/cities";
import Countries from "../admin/content/location/countries";
import States from "../admin/content/location/states";
import Pages from "../admin/content/pages";
import Testimonials from "../admin/content/testimonials";
import StaffAttendance from "../admin/hrm/attendance/staff-attendance";
import StudentAttendance from "../admin/hrm/attendance/student-attendance";
import EditStaff from "../admin/hrm/staff-list/edit-staff";
import Staff from "../admin/hrm/staff-list/staff";
import StaffDetails from "../admin/hrm/staff-list/staff-details.tsx";
import StaffLeave from "../admin/hrm/staff-list/staff-leave";
import StaffPayRoll from "../admin/hrm/staff-list/staff-payroll.tsx";
import StaffsAttendance from "../admin/hrm/staff-list/staffs-attendance";
import CollectFees from "../admin/management/feescollection/collectFees";
import FeesAssign from "../admin/management/feescollection/feesAssign";
import FeesGroup from "../admin/management/feescollection/feesGroup";
import FeesMaster from "../admin/management/feescollection/feesMaster";
import FeesTypes from "../admin/management/feescollection/feesTypes";
import HostelList from "../admin/management/hostel/hostelList";
import HostelRooms from "../admin/management/hostel/hostelRooms";
import HostelType from "../admin/management/hostel/hostelType";
import Books from "../admin/management/library/books";
import IssueBook from "../admin/management/library/issuesBook";
import LibraryMember from "../admin/management/library/libraryMember";
import ReturnBook from "../admin/management/library/returnBook";
import PlayersList from "../admin/management/sports/playersList";
import SportsList from "../admin/management/sports/sportsList";
import TransportAssignVehicle from "../admin/management/transport/transportAssignVehicle";
import TransportPickupPoints from "../admin/management/transport/transportPickupPoints";
import TransportRoutes from "../admin/management/transport/transportRoutes";
import TransportVehicle from "../admin/management/transport/transportVehicle";
import TransportVehicleDrivers from "../admin/management/transport/transportVehicleDrivers";
import MembershipAddon from "../admin/membership/membershipaddon";
import Membershipplan from "../admin/membership/membershipplan";
import MembershipTransaction from "../admin/membership/membershiptrasaction";
import BlankPage from "../admin/pages/blankPage";
import ComingSoon from "../admin/pages/comingSoon";
import Profile from "../admin/pages/profile";
import NotificationActivities from "../admin/pages/profile/activities";
import UnderMaintenance from "../admin/pages/underMaintenance";

import Departments from "../admin/hrm/departments";
import Designation from "../admin/hrm/designation";
import Holiday from "../admin/hrm/holidays";
import ApproveRequest from "../admin/hrm/leaves/approve-request";
import ListLeaves from "../admin/hrm/leaves/list-leaves";
import Payroll from "../admin/hrm/payroll";
import AddStaff from "../admin/hrm/staff-list/add-staff";

import GuardianGrid from "../admin/peoples/guardian/guardian-grid";
import GuardianList from "../admin/peoples/guardian/guardian-list";
import ParentGrid from "../admin/peoples/parent/parent-grid";
import ParentList from "../admin/peoples/parent/parent-list";
import AddStudent from "../admin/peoples/students/add-student";
import EditStudent from "../admin/peoples/students/editStudent";
import StudentDetails from "../admin/peoples/students/student-details/studentDetails";
import StudentFees from "../admin/peoples/students/student-details/studentFees";
import StudentLeaves from "../admin/peoples/students/student-details/studentLeaves";
import StudentLibrary from "../admin/peoples/students/student-details/studentLibrary";
import StudentResult from "../admin/peoples/students/student-details/studentResult";
import StudentTimeTable from "../admin/peoples/students/student-details/studentTimeTable";
import StudentList from "../admin/peoples/students/student-list";
import StudentPromotion from "../admin/peoples/students/student-promotion";
import StudentOnboarding from "../admin/peoples/students/student-onboarding";
import TeacherDetails from "../admin/peoples/teacher/teacher-details/teacherDetails";
import TeacherLeave from "../admin/peoples/teacher/teacher-details/teacherLeave";
import TeacherLibrary from "../admin/peoples/teacher/teacher-details/teacherLibrary";
import TeacherSalary from "../admin/peoples/teacher/teacher-details/teacherSalary";
import TeachersRoutine from "../admin/peoples/teacher/teacher-details/teachersRoutine";
import TeacherGrid from "../admin/peoples/teacher/teacher-grid";
import TeacherList from "../admin/peoples/teacher/teacher-list";
import TeacherForm from "../admin/peoples/teacher/teacherForm";
import EditTeacher from "../admin/peoples/teacher/edit-teacher";
import AttendanceReport from "../admin/report/attendance-report/attendanceReport";
import DailyAttendance from "../admin/report/attendance-report/dailyAttendance";
import StaffDayWise from "../admin/report/attendance-report/staffDayWise";
import StaffReport from "../admin/report/attendance-report/staffReport";
import StudentAttendanceType from "../admin/report/attendance-report/studentAttendanceType";
import StudentDayWise from "../admin/report/attendance-report/studentDayWise";
import TeacherDayWise from "../admin/report/attendance-report/teacherDayWise";
import TeacherReport from "../admin/report/attendance-report/teacherReport";
import ClassReport from "../admin/report/class-report/classReport";
import FeesReport from "../admin/report/fees-report/feesReport";
import GradeReport from "../admin/report/grade-report/gradeReport";
import LeaveReport from "../admin/report/leave-report/leaveReport";
import StudentReport from "../admin/report/student-report/studentReport";
import Religion from "../admin/settings/academicSettings/religion";
import SchoolSettings from "../admin/settings/academicSettings/schoolSettings";
import CustomFields from "../admin/settings/appSettings/customFields";
import InvoiceSettings from "../admin/settings/appSettings/invoiceSettings";
import PaymentGateways from "../admin/settings/financialSettings/paymentGateways";
import TaxRates from "../admin/settings/financialSettings/taxRates";
import ConnectedApps from "../admin/settings/generalSettings/connectedApps";
import Notificationssettings from "../admin/settings/generalSettings/notifications";
import Profilesettings from "../admin/settings/generalSettings/profile";
import Securitysettings from "../admin/settings/generalSettings/security";
import BanIpAddress from "../admin/settings/otherSettings/banIpaddress";
import Emailtemplates from "../admin/settings/systemSettings/email-templates";
import EmailSettings from "../admin/settings/systemSettings/emailSettings";
import GdprCookies from "../admin/settings/systemSettings/gdprCookies";
import OtpSettings from "../admin/settings/systemSettings/otp-settings";
import SmsSettings from "../admin/settings/systemSettings/smsSettings";
import CompanySettings from "../admin/settings/websiteSettings/companySettings";
import Languagesettings from "../admin/settings/websiteSettings/language";
import Localization from "../admin/settings/websiteSettings/localization";
import Preference from "../admin/settings/websiteSettings/preference";
import Prefixes from "../admin/settings/websiteSettings/prefixes";
import Socialauthentication from "../admin/settings/websiteSettings/socialAuthentication";
import ContactMessages from "../admin/support/contactMessages";
import TicketDetails from "../admin/support/ticket-details";
import TicketGrid from "../admin/support/ticket-grid";
import Tickets from "../admin/support/tickets";
import ClipBoard from "../admin/uiInterface/advanced-ui/clipboard";
import Counter from "../admin/uiInterface/advanced-ui/counter";
import RangeSlides from "../admin/uiInterface/advanced-ui/rangeslider";
import Rating from "../admin/uiInterface/advanced-ui/rating";
import Stickynote from "../admin/uiInterface/advanced-ui/stickynote";
import TextEditor from "../admin/uiInterface/advanced-ui/texteditor";
import Scrollbar from "../admin/uiInterface/advanced-ui/uiscrollbar";
import AlertUi from "../admin/uiInterface/base-ui/alert-ui";
import Badges from "../admin/uiInterface/base-ui/badges";
import Borders from "../admin/uiInterface/base-ui/borders";
import Buttons from "../admin/uiInterface/base-ui/buttons";
import ButtonsGroup from "../admin/uiInterface/base-ui/buttonsgroup";
import Cards from "../admin/uiInterface/base-ui/cards";
import Colors from "../admin/uiInterface/base-ui/colors";
import Dropdowns from "../admin/uiInterface/base-ui/dropdowns";
import Images from "../admin/uiInterface/base-ui/images";
import Lightboxes from "../admin/uiInterface/base-ui/lightbox";
import Media from "../admin/uiInterface/base-ui/media";
import Modals from "../admin/uiInterface/base-ui/modals";
import NavTabs from "../admin/uiInterface/base-ui/navtabs";
import Popovers from "../admin/uiInterface/base-ui/popover";
import Toasts from "../admin/uiInterface/base-ui/toasts";
import Tooltips from "../admin/uiInterface/base-ui/tooltips";
import Apexchart from "../admin/uiInterface/charts/apexcharts";
import BasicInputs from "../admin/uiInterface/forms/formelements/basic-inputs";
import CheckboxRadios from "../admin/uiInterface/forms/formelements/checkbox-radios";
import FileUpload from "../admin/uiInterface/forms/formelements/fileupload";
import FormMask from "../admin/uiInterface/forms/formelements/form-mask";
import FormWizard from "../admin/uiInterface/forms/formelements/form-wizard";
import GridGutters from "../admin/uiInterface/forms/formelements/grid-gutters";
import FormHorizontal from "../admin/uiInterface/forms/formelements/layouts/form-horizontal";
import FormSelect2 from "../admin/uiInterface/forms/formelements/layouts/form-select2";
import FormValidation from "../admin/uiInterface/forms/formelements/layouts/form-validation";
import FormVertical from "../admin/uiInterface/forms/formelements/layouts/form-vertical";
import FontawesomeIcons from "../admin/uiInterface/icons/fontawesome";
import IonicIcons from "../admin/uiInterface/icons/ionicicons";
import MaterialIcons from "../admin/uiInterface/icons/materialicon";
import PE7Icons from "../admin/uiInterface/icons/pe7icons";
import ThemifyIcons from "../admin/uiInterface/icons/themify";
import TypiconIcons from "../admin/uiInterface/icons/typicons";
import WeatherIcons from "../admin/uiInterface/icons/weathericons";
import DataTables from "../admin/uiInterface/table/data-tables";
import TablesBasic from "../admin/uiInterface/table/tables-basic";
import DeleteRequest from "../admin/userManagement/deleteRequest";
import Manageusers from "../admin/userManagement/manageusers";
import Permission from "../admin/userManagement/permission";
import RolesPermissions from "../admin/userManagement/rolesPermissions";
import Accordion from "../admin/uiInterface/base-ui/accordion";
import Avatar from "../admin/uiInterface/base-ui/avatar";
import Breadcrumb from "../admin/uiInterface/base-ui/breadcrumb";
import Carousel from "../admin/uiInterface/base-ui/carousel";
import Offcanvas from "../admin/uiInterface/base-ui/offcanvas";
import Pagination from "../admin/uiInterface/base-ui/pagination";
import Progress from "../admin/uiInterface/base-ui/progress";
import Spinner from "../admin/uiInterface/base-ui/spinner";
import Typography from "../admin/uiInterface/base-ui/typography";
import Timeline from "../admin/uiInterface/advanced-ui/timeline";
import InputGroup from "../admin/uiInterface/forms/formelements/input-group";
import FormSelect from "../admin/uiInterface/forms/formelements/form-select";
import Placeholder from "../admin/uiInterface/base-ui/placeholder";
import Alert from "../admin/uiInterface/base-ui/alert";
import Video from "../admin/uiInterface/base-ui/video";

import StudentGrid from "../admin/peoples/students/student-grid/index.tsx";
import Storage from "../admin/settings/otherSettings/storage.tsx";
import TeacherAttendance from "../admin/hrm/attendance/teacher-attendance.tsx";
import ExamMarkUpload from "../admin/academic/examinations/exam-results/EditExamResult.tsx";
const routes = all_routes;

export const publicRoutes = [
  {
    path: "/",
    name: "Root",
    element: <Navigate to="/login" />,
    route: Route,
  },
  {
    path: routes.adminDashboard,
    element: <AdminDashboard />,
    route: Route,
  },
  {
    path: routes.teacherDashboard,
    element: <TeacherDashboard />,
    route: Route,
  },
  {
    path: `${routes.studentDashboard}`,
    element: <StudentDasboard />,
    route: Route,
  },

  {
    path: routes.parentDashboard,
    element: <ParentDashboard />,
    route: Route,
  },
  {
    path: routes.audioCall,
    element: <AudioCall />,
    route: Route,
  },
  {
    path: routes.callHistory,
    element: <CallHistory />,
    route: Route,
  },
  {
    path: routes.callHistory,
    element: <CallHistory />,
    route: Route,
  },

  {
    path: routes.connectedApps,
    element: <ConnectedApps />,
    route: Route,
  },
  {
    path: routes.countries,
    element: <Countries />,
    route: Route,
  },
  {
    path: routes.blankPage,
    element: <BlankPage />,
    route: Route,
  },
  {
    path: routes.calendar,
    element: <Calendar />,
    route: Route,
  },

  {
    path: routes.membershipplan,
    element: <Membershipplan />,
  },
  {
    path: routes.membershipAddon,
    element: <MembershipAddon />,
  },
  {
    path: routes.membershipTransaction,
    element: <MembershipTransaction />,
  },
  {
    path: routes.notes,
    element: <Notes />,
  },
  {
    path: routes.countries,
    element: <Countries />,
    route: Route,
  },
  {
    path: routes.customFields,
    element: <CustomFields />,
    route: Route,
  },
  // // {
  // //   path: routes.dataTables,
  // //   element: <DataTable />,
  // //   route: Route,
  // // },
  // // {
  // //   path: routes.tablesBasic,
  // //   element: <BasicTable />,
  // //   route: Route,
  // // },

  {
    path: routes.deleteRequest,
    element: <DeleteRequest />,
    route: Route,
  },
  {
    path: routes.cities,
    element: <Cities />,
    route: Route,
  },

  {
    path: routes.accordion,
    element: <Accordion />,
    route: Route,
  },
  {
    path: routes.avatar,
    element: <Avatar />,
    route: Route,
  },
  {
    path: routes.badges,
    element: <Badges />,
    route: Route,
  },
  {
    path: routes.border,
    element: <Borders />,
    route: Route,
  },
  {
    path: routes.breadcrums,
    element: <Breadcrumb />,
    route: Route,
  },
  {
    path: routes.button,
    element: <Buttons />,
    route: Route,
  },
  {
    path: routes.buttonGroup,
    element: <ButtonsGroup />,
    route: Route,
  },
  {
    path: routes.cards,
    element: <Cards />,
    route: Route,
  },
  {
    path: routes.carousel,
    element: <Carousel />,
    route: Route,
  },
  {
    path: routes.colors,
    element: <Colors />,
    route: Route,
  },
  {
    path: routes.dropdowns,
    element: <Dropdowns />,
    route: Route,
  },
  // // {
  // //   path: routes.grid,
  // //   element: <Grid />,
  // //   route: Route,
  // // },
  {
    path: routes.images,
    element: <Images />,
    route: Route,
  },
  {
    path: routes.lightbox,
    element: <Lightboxes />,
    route: Route,
  },
  {
    path: routes.media,
    element: <Media />,
    route: Route,
  },
  {
    path: routes.modals,
    element: <Modals />,
    route: Route,
  },
  {
    path: routes.navTabs,
    element: <NavTabs />,
    route: Route,
  },
  {
    path: routes.offcanvas,
    element: <Offcanvas />,
    route: Route,
  },
  {
    path: routes.pagination,
    element: <Pagination />,
    route: Route,
  },
  {
    path: routes.popover,
    element: <Popovers />,
    route: Route,
  },
  {
    path: routes.rangeSlider,
    element: <RangeSlides />,
    route: Route,
  },
  {
    path: routes.progress,
    element: <Progress />,
    route: Route,
  },
  {
    path: routes.spinner,
    element: <Spinner />,
    route: Route,
  },

  {
    path: routes.typography,
    element: <Typography />,
    route: Route,
  },
  {
    path: routes.video,
    element: <Video />,
    route: Route,
  },
  {
    path: routes.toasts,
    element: <Toasts />,
    route: Route,
  },
  {
    path: routes.banIpAddress,
    element: <BanIpAddress />,
    route: Route,
  },
  // // {
  // //   path: routes.localization,
  // //   element: <Localization />,
  // //   route: Route,
  // // },
  {
    path: routes.preference,
    element: <Preference />,
    route: Route,
  },
  {
    path: routes.todo,
    element: <Todo />,
    route: Route,
  },
  {
    path: routes.email,
    element: <Email />,
    route: Route,
  },
  {
    path: routes.videoCall,
    element: <Videocall />,
    route: Route,
  },
  {
    path: routes.chat,
    element: <Chat />,
    route: Route,
  },
  {
    path: routes.pages,
    element: <Pages />,
    route: Route,
  },

  {
    path: routes.fileManager,
    element: <FileManager />,
    route: Route,
  },
  {
    path: routes.faq,
    element: <Faq />,
    route: Route,
  },

  {
    path: routes.states,
    element: <States />,
    route: Route,
  },
  {
    path: routes.testimonials,
    element: <Testimonials />,
    route: Route,
  },
  {
    path: routes.clipboard,
    element: <ClipBoard />,
    route: Route,
  },
  {
    path: routes.counter,
    element: <Counter />,
    route: Route,
  },
  // // {
  // //   path: routes.dragandDrop,
  // //   element: <DragAndDrop />,
  // //   route: Route,
  // // },
  {
    path: routes.rating,
    element: <Rating />,
    route: Route,
  },
  {
    path: routes.stickyNotes,
    element: <Stickynote />,
    route: Route,
  },
  {
    path: routes.textEditor,
    element: <TextEditor />,
    route: Route,
  },
  {
    path: routes.timeLine,
    element: <Timeline />,
    route: Route,
  },
  {
    path: routes.scrollBar,
    element: <Scrollbar />,
    route: Route,
  },
  {
    path: routes.apexChat,
    element: <Apexchart />,
    route: Route,
  },

  {
    path: routes.fantawesome,
    element: <FontawesomeIcons />,
    route: Route,
  },
  {
    path: routes.fantawesome,
    element: <FontawesomeIcons />,
    route: Route,
  },
  {
    path: routes.materialIcon,
    element: <MaterialIcons />,
    route: Route,
  },
  {
    path: routes.pe7icon,
    element: <PE7Icons />,
    route: Route,
  },

  {
    path: routes.themifyIcon,
    element: <ThemifyIcons />,
    route: Route,
  },
  {
    path: routes.typicon,
    element: <TypiconIcons />,
    route: Route,
  },
  {
    path: routes.basicInput,
    element: <BasicInputs />,
    route: Route,
  },
  {
    path: routes.weatherIcon,
    element: <WeatherIcons />,
    route: Route,
  },
  {
    path: routes.checkboxandRadion,
    element: <CheckboxRadios />,
    route: Route,
  },
  {
    path: routes.inputGroup,
    element: <InputGroup />,
    route: Route,
  },
  {
    path: routes.gridandGutters,
    element: <GridGutters />,
    route: Route,
  },
  {
    path: routes.formSelect,
    element: <FormSelect />,
    route: Route,
  },
  {
    path: routes.formMask,
    element: <FormMask />,
    route: Route,
  },
  {
    path: routes.fileUpload,
    element: <FileUpload />,
    route: Route,
  },
  {
    path: routes.horizontalForm,
    element: <FormHorizontal />,
    route: Route,
  },
  {
    path: routes.verticalForm,
    element: <FormVertical />,
    route: Route,
  },

  {
    path: routes.formValidation,
    element: <FormValidation />,
    route: Route,
  },
  {
    path: routes.reactSelect,
    element: <FormSelect2 />,
    route: Route,
  },
  {
    path: routes.formWizard,
    element: <FormWizard />,
    route: Route,
  },
  {
    path: routes.dataTable,
    element: <DataTables />,
    route: Route,
  },
  {
    path: routes.tableBasic,
    element: <TablesBasic />,
    route: Route,
  },
  {
    path: routes.iconicIcon,
    element: <IonicIcons />,
    route: Route,
  },


  {
    path: routes.placeholder,
    element: <Placeholder />,
    route: Route,
  },
  {
    path: routes.sweetalert,
    element: <Alert />,
    route: Route,
  },
  {
    path: routes.alert,
    element: <AlertUi />,
    route: Route,
  },
  {
    path: routes.tooltip,
    element: <Tooltips />,
    route: Route,
  },
  {
    path: routes.ribbon,
    element: <Ribbon />,
    route: Route,
  },

  // // Peoples Module
  {
    path: routes.studentGrid,
    element: <StudentGrid />,
    route: Route,
  },
  {
    path: routes.studentList,
    element: <StudentList />,
    route: Route,
  },
  {
    path: routes.addStudent,
    element: <AddStudent />,
    route: Route,
  },
  {
    path: `${routes.editStudent}/:rollnum`,
    element: <EditStudent />,
    route: Route,
  },
  {
    path: `${routes.studentLibrary}/:rollnum`,
    element: <StudentLibrary />,
    route: Route,
  },
  {
    path: `${routes.studentDetail}/:rollnum`,
    element: <StudentDetails />,
    route: Route,
  },
  {
    path: `${routes.studentFees}/:rollnum`,
    element: <StudentFees />,
    route: Route,
  },
  {
    path: `${routes.studentLeaves}/:rollnum`,
    element: <StudentLeaves />,
    route: Route,
  },
  {
    path: `${routes.studentResult}/:rollnum`,
    element: <StudentResult />,
    route: Route,
  },
  {
    path: `${routes.studentTimeTable}/:rollnum`,
    element: <StudentTimeTable />,
    route: Route,
  },
  {
    path: routes.studentPromotion,
    element: <StudentPromotion />,
    route: Route,
  },
  {
    path: routes.studentOnboarding,
    element: <StudentOnboarding />,
    route: Route,
  },
  {
    path: routes.AcademicReason,
    element: <AcademicReason />,
    route: Route,
  },
  {
    path: routes.classSyllabus,
    element: <ClassSyllabus />,
    route: Route,
  },
  {
    path: routes.classSubject,
    element: <ClassSubject />,
    route: Route,
  },
  {
    path: routes.classSection,
    element: <ClassSection />,
    route: Route,
  },
  {
    path: routes.classRoom,
    element: <ClassRoom />,
    route: Route,

  },
  {
    path: routes.classRoutine,
    element: <ClassRoutine />,
    route: Route,

  },
  {
    path: routes.sheduleClasses,
    element: <ScheduleClasses />,
    route: Route,
  },

  {
    path: routes.exam,
    element: <Exam />,
    route: Route,
  },
  {
    path: routes.examSchedule,
    element: <ExamSchedule />,
    route: Route,

  },
  {
    path: routes.grade,
    element: <Grade />,
    route: Route,
  },
  {
    path: routes.staff,
    element: <Staff />,
    route: Route,
  },
  {
    path: routes.departments,
    element: <Departments />,
    route: Route,
  },
  {
    path: routes.classes,
    element: <Classes />,
    route: Route,
  },
  {
    path: routes.classHomeWork,
    element: <ClassHomeWork />,
    route: Route,
  },
  {
    path: routes.examResult,
    element: <ExamResult />,
    route: Route,
  },
  {
    path: routes.updateExamResult,
    element: <ExamMarkUpload />,
    route: Route,
  },
  {
    path: routes.examAttendance,
    element: <ExamAttendance />,
    route: Route,
  },
  {
    path: routes.teacherGrid,
    element: <TeacherGrid />,
    route: Route,
  },
  {
    path: routes.teacherList,
    element: <TeacherList />,
    route: Route,
  },
  {
    path: routes.addTeacher,
    element: <TeacherForm />,
    route: Route,
  },
  {
    path: `${routes.editTeacher}/:teacher_id`,
    element: <EditTeacher />,
    route: Route,
  },

  {
    path: `${routes.teacherDetails}/:teacher_id`,
    element: <TeacherDetails />,
    route: Route,
  },
  {
    path: `${routes.teachersRoutine}/:teacher_id`,
    element: <TeachersRoutine />,
    route: Route,
  },
  {
    path: `${routes.teacherSalary}/:teacher_id`,
    element: <TeacherSalary />,
    route: Route,
  },
  {
    path: `${routes.teacherLeaves}/:teacher_id`,
    element: <TeacherLeave />,
    route: Route,
  },
  {
    path: `${routes.teacherLibrary}/:teacher_id`,
    element: <TeacherLibrary />,
    route: Route,
  },
  {
    path: routes.parentGrid,
    element: <ParentGrid />,
    route: Route,
  },
  {
    path: routes.parentList,
    element: <ParentList />,
    route: Route,
  },
  {
    path: routes.classTimetable,
    element: <ClassTimetable />,
    route: Route,
  },
  {
    path: routes.payroll,
    element: <Payroll />,
    route: Route,
  },
  {
    path: routes.holidays,
    element: <Holiday />,
    route: Route,
  },
  {
    path: routes.designation,
    element: <Designation />,
    route: Route,
  },
  {
    path: routes.listLeaves,
    element: <ListLeaves />,
    route: Route,
  },
  {
    path:`${routes.staffDetails}/:staffid`,
    element: <StaffDetails />,
    route: Route,
  },
  {
    path: `${routes.staffPayroll}/:staffid`,
    element: <StaffPayRoll />,
    route: Route,
  },
  {
    path: `${routes.staffLeave}/:staffid`,
    element: <StaffLeave />,
    route: Route,
  },

  {
    path: routes.layoutDefault,
    element: <AdminDashboard />,
    route: Route,
  },
  {
    path: routes.layoutMini,
    element: <AdminDashboard />,
    route: Route,
  },
  {
    path: routes.layoutRtl,
    element: <AdminDashboard />,
    route: Route,
  },
  {
    path: routes.layoutBox,
    element: <AdminDashboard />,
    route: Route,
  },
  {
    path: routes.layoutDark,
    element: <AdminDashboard />,
    route: Route,
  },
  {
    path: routes.guardiansGrid,
    element: <GuardianGrid />,
    route: Route,
  },
  {
    path: routes.guardiansList,
    element: <GuardianList />,
    route: Route,
  },
  {
    path: routes.feesGroup,
    element: <FeesGroup />,
    route: Route,
  },
  {
    path: routes.feesType,
    element: <FeesTypes />,
    route: Route,
  },
  {
    path: routes.feesMaster,
    element: <FeesMaster />,
    route: Route,
  },
  {
    path: routes.feesAssign,
    element: <FeesAssign />,
    route: Route,
  },
  {
    path: routes.collectFees,
    element: <CollectFees />,
    route: Route,
  },
  {
    path: routes.libraryMembers,
    element: <LibraryMember />,
    route: Route,
  },
  {
    path: routes.libraryBooks,
    element: <Books />,
    route: Route,
  },
  {
    path: routes.libraryIssueBook,
    element: <IssueBook />,
    route: Route,
  },
  {
    path: routes.libraryReturn,
    element: <ReturnBook />,
    route: Route,
  },
  {
    path: routes.sportsList,
    element: <SportsList />,
    route: Route,
  },
  {
    path: routes.playerList,
    element: <PlayersList />,
    route: Route,
  },
  {
    path: routes.hostelRoom,
    element: <HostelRooms />,
    route: Route,
  },
  {
    path: routes.hostelType,
    element: <HostelType />,
    route: Route,
  },
  {
    path: routes.hostelList,
    element: <HostelList />,
    route: Route,
  },
  {
    path: routes.transportRoutes,
    element: <TransportRoutes />,
    route: Route,
  },
  {
    path: routes.transportAssignVehicle,
    element: <TransportAssignVehicle />,
    route: Route,
  },
  {
    path: routes.transportPickupPoints,
    element: <TransportPickupPoints />,
    route: Route,
  },
  {
    path: routes.transportVehicleDrivers,
    element: <TransportVehicleDrivers />,
    route: Route,
  },
  {
    path: routes.transportVehicle,
    element: <TransportVehicle />,
    route: Route,
  },
  {
    path: routes.approveRequest,
    element: <ApproveRequest />,
    route: Route,
  },
  {
    path: routes.studentAttendance,
    element: <StudentAttendance />,
    route: Route,
  },
  {
    path: routes.teacherAttendance,
    element: <TeacherAttendance />,
    route: Route,
  },


  {
    path: routes.staffAttendance,
    element: <StaffAttendance />,
    route: Route,
  },
  {
    path: `${routes.staffsAttendance}/:staffid`,
    element: <StaffsAttendance />,
    route: Route,
  },
  {
    path: routes.addStaff,
    element: <AddStaff />,
    route: Route,
  },
  {
    path: `${routes.editStaff}/:staffid`,
    element: <EditStaff />,
    route: Route,
  },

  {
    path: routes.accountsIncome,
    element: <AccountsIncome />,
    route: Route,
  },
  {
    path: routes.accountsInvoices,
    element: <AccountsInvoices />,
    route: Route,
  },
  {
    path: routes.accountsTransactions,
    element: <AccountsTransactions />,
    route: Route,
  },
  {
    path: routes.addInvoice,
    element: <AddInvoice />,
    route: Route,
  },
  {
    path: routes.editInvoice,
    element: <EditInvoice />,
    route: Route,
  },
  {
    path: routes.guardiansList,
    element: <GuardianList />,
    route: Route,
  },
  {
    path: routes.expense,
    element: <Expense />,
    route: Route,
  },
  {
    path: routes.expenseCategory,
    element: <ExpensesCategory />,
    route: Route,
  },
  {
    path: routes.invoice,
    element: <Invoice />,
    route: Route,
  },
  {
    path: routes.events,
    element: <Events />,
    route: Route,
  },
  {
    path: routes.noticeBoard,
    element: <NoticeBoard />,
    route: Route,
  },

  // //Settings

  {
    path: routes.profilesettings,
    element: <Profilesettings />,
    route: Route,
  },
  {
    path: routes.securitysettings,
    element: <Securitysettings />,
    route: Route,
  },
  {
    path: routes.notificationssettings,
    element: <Notificationssettings />,
    route: Route,
  },
  {
    path: routes.connectedApps,
    element: <ConnectedApps />,
    route: Route,
  },
  {
    path: routes.companySettings,
    element: <CompanySettings />,
    route: Route,
  },
  {
    path: routes.localization,
    element: <Localization />,
    route: Route,
  },
  {
    path: routes.prefixes,
    element: <Prefixes />,
    route: Route,
  },
  {
    path: routes.socialAuthentication,
    element: <Socialauthentication />,
    route: Route,
  },
  {
    path: routes.language,
    element: <Languagesettings />,
    route: Route,
  },
  {
    path: routes.invoiceSettings,
    element: <InvoiceSettings />,
    route: Route,
  },
  {
    path: routes.customFields,
    element: <CustomFields />,
    route: Route,
  },
  {
    path: routes.emailSettings,
    element: <EmailSettings />,
    route: Route,
  },
  {
    path: routes.emailTemplates,
    element: <Emailtemplates />,
    route: Route,
  },
  {
    path: routes.smsSettings,
    element: <SmsSettings />,
    route: Route,
  },
  {
    path: routes.optSettings,
    element: <OtpSettings />,
    route: Route,
  },
  {
    path: routes.gdprCookies,
    element: <GdprCookies />,
    route: Route,
  },

  {
    path: routes.paymentGateways,
    element: <PaymentGateways />,
    route: Route,
  },
  {
    path: routes.taxRates,
    element: <TaxRates />,
    route: Route,
  },
  {
    path: routes.schoolSettings,
    element: <SchoolSettings />,
    route: Route,
  },
  {
    path: routes.religion,
    element: <Religion />,
    route: Route,
  },
  {
    path: routes.storage,
    element: <Storage />,
    route: Route,
  },

  {
    path: routes.rolesPermissions,
    element: <RolesPermissions />,
    route: Route,
  },
  {
    path: routes.permissions,
    element: <Permission />,
    route: Route,
  },
  {
    path: routes.manageusers,
    element: <Manageusers />,
    route: Route,
  },
  {
    path: routes.allBlogs,
    element: <AllBlogs />,
    route: Route,
  },
  {
    path: routes.blogCategories,
    element: <BlogCategories />,
    route: Route,
  },
  {
    path: routes.blogComments,
    element: <BlogComments />,
    route: Route,
  },
  {
    path: routes.blogTags,
    element: <BlogTags />,
    route: Route,
  },
  {
    path: routes.tickets,
    element: <Tickets />,
    route: Route,
  },
  {
    path: routes.ticketGrid,
    element: <TicketGrid />,
    route: Route,
  },
  {
    path: routes.ticketDetails,
    element: <TicketDetails />,
    route: Route,
  },
  {
    path: routes.feesReport,
    element: <FeesReport />,
    route: Route,
  },
  {
    path: routes.leaveReport,
    element: <LeaveReport />,
    route: Route,
  },
  {
    path: routes.gradeReport,
    element: <GradeReport />,
    route: Route,
  },
  {
    path: routes.studentReport,
    element: <StudentReport />,
    route: Route,
  },
  {
    path: routes.classReport,
    element: <ClassReport />,
    route: Route,
  },
  {
    path: routes.attendanceReport,
    element: <AttendanceReport />,
    route: Route,
  },
  {
    path: routes.studentAttendanceType,
    element: <StudentAttendanceType />,
    route: Route,
  },
  {
    path: routes.dailyAttendance,
    element: <DailyAttendance />,
    route: Route,
  },
  {
    path: routes.studentDayWise,
    element: <StudentDayWise />,
    route: Route,
  },
  {
    path: routes.teacherDayWise,
    element: <TeacherDayWise />,
    route: Route,
  },
  {
    path: routes.staffDayWise,
    element: <StaffDayWise />,
    route: Route,
  },
  {
    path: routes.teacherReport,
    element: <TeacherReport />,
    route: Route,
  },
  {
    path: routes.staffReport,
    element: <StaffReport />,
    route: Route,
  },
  {
    path: routes.contactMessages,
    element: <ContactMessages />,
    route: Route,
  },
  {
    path: routes.events,
    element: <Events />,
    route: Route,
  },
  {
    path: routes.profile,
    element: <Profile />,
    route: Route,
  },
  {
    path: routes.activity,
    element: <NotificationActivities />,
    route: Route,
  },
];

export const authRoutes = [
  {
    path: routes.comingSoon,
    element: <ComingSoon />,
    route: Route,
  },
  {
    path: routes.login,
    element: <Login />,
    route: Route,
  },
  // {
  //   path: routes.login2,
  //   element: <Login2 />,
  //   route: Route,
  // },
  // {
  //   path: routes.login3,
  //   element: <Login3 />,
  //   route: Route,
  // },
  // {
  //   path: routes.register,
  //   element: <Register />,
  //   route: Route,
  // },
  // {
  //   path: routes.twoStepVerification,
  //   element: <TwoStepVerification />,
  //   route: Route,
  // },
  // {
  //   path: routes.twoStepVerification2,
  //   element: <TwoStepVerification2 />,
  //   route: Route,
  // },
  // {
  //   path: routes.twoStepVerification3,
  //   element: <TwoStepVerification3 />,
  //   route: Route,
  // },
  // {
  //   path: routes.emailVerification,
  //   element: <EmailVerification />,
  //   route: Route,
  // },
  // {
  //   path: routes.emailVerification2,
  //   element: <EmailVerification2 />,
  //   route: Route,
  // },
  // {
  //   path: routes.emailVerification3,
  //   element: <EmailVerification3 />,
  //   route: Route,
  // },
  // {
  //   path: routes.register,
  //   element: <Register />,
  //   route: Route,
  // },
  // {
  //   path: routes.register2,
  //   element: <Register2 />,
  //   route: Route,
  // },
  // {
  //   path: routes.register3,
  //   element: <Register3 />,
  //   route: Route,
  // },
  {
    path: routes.resetPassword,
    element: <ResetPassword />,
    route: Route,
  },
  // {
  //   path: routes.resetPassword2,
  //   element: <ResetPassword2 />,
  //   route: Route,
  // },
  // {
  //   path: routes.resetPassword3,
  //   element: <ResetPassword3 />,
  //   route: Route,
  // },
  {
    path: routes.forgotPassword,
    element: <ForgotPassword />,
    route: Route,
  },
  // {
  //   path: routes.forgotPassword2,
  //   element: <ForgotPassword2 />,
  //   route: Route,
  // },
  // {
  //   path: routes.forgotPassword3,
  //   element: <ForgotPassword3 />,
  //   route: Route,
  // },
  {
    path: routes.error404,
    element: <Error404 />,
    route: Route,
  },
  {
    path: routes.error500,
    element: <Error500 />,
    route: Route,
  },
  {
    path: routes.underMaintenance,
    element: <UnderMaintenance />,
    route: Route,
  },
  //   {
  //     path: routes.lockScreen,
  //     element: <LockScreen />,
  //   },
    {
      path: routes.resetPasswordSuccess,
      element: <ResetPasswordSuccess />,
    },
  //   {
  //     path: routes.resetPasswordSuccess2,
  //     element: <ResetPasswordSuccess2 />,
  //   },
  //   {
  //     path: routes.resetPasswordSuccess3,
  //     element: <ResetPasswordSuccess3 />,
  //   },
];
