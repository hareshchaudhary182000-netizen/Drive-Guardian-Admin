import { Admin, Resource } from 'react-admin';
import { BrowserRouter } from 'react-router-dom';
import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';
import { lightTheme, darkTheme } from './theme';
import { LoginPage } from './LoginPage';
import { MyLayout } from './Layout';
import { Dashboard } from './dashboard/Dashboard';

import { FeedbackList, FeedbackShow, feedbackIcon } from './resources/feedback';
import { UsersList, UsersShow, usersIcon } from './resources/users';
import { PartnersList, partnersIcon } from './resources/partners';
import { ActivityList, activityIcon } from './resources/activityLogs';
import { ReportsList, reportsIcon } from './resources/reports';
import { AdsList, AdsCreate, AdsEdit, adsIcon } from './resources/ads';
import {
  NotificationsList,
  NotificationsCreate,
  NotificationsEdit,
  notificationsIcon,
} from './resources/notifications';

const App = () => (
  <BrowserRouter>
    <Admin
      title="DriveGuardian Admin"
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={LoginPage}
      layout={MyLayout}
      dashboard={Dashboard}
      theme={lightTheme}
      darkTheme={darkTheme}
      defaultTheme="light"
      requireAuth
    >
    <Resource
      name="feedback"
      list={FeedbackList}
      show={FeedbackShow}
      icon={feedbackIcon}
      options={{ label: 'Feedback' }}
    />
    <Resource
      name="profiles"
      list={UsersList}
      show={UsersShow}
      icon={usersIcon}
      options={{ label: 'Drivers' }}
      recordRepresentation="name"
    />
    <Resource
      name="partners"
      list={PartnersList}
      icon={partnersIcon}
      options={{ label: 'Partners' }}
    />
    <Resource
      name="activity_logs"
      list={ActivityList}
      icon={activityIcon}
      options={{ label: 'Activity' }}
    />
    <Resource
      name="reports"
      list={ReportsList}
      icon={reportsIcon}
      options={{ label: 'Reports' }}
    />
    <Resource
      name="ads"
      list={AdsList}
      create={AdsCreate}
      edit={AdsEdit}
      icon={adsIcon}
      options={{ label: 'Sponsored Ads' }}
      />
    <Resource
      name="notifications"
      list={NotificationsList}
      create={NotificationsCreate}
      edit={NotificationsEdit}
      icon={notificationsIcon}
      options={{ label: 'Notifications' }}
    />
    </Admin>
  </BrowserRouter>
);

export default App;
