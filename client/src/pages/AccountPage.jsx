import { useSearchParams } from 'react-router-dom';

import AccountSidebar from '../components/account/AccountSidebar';
import ProfileTab from '../components/account/ProfileTab';
import SecurityTab from '../components/account/SecurityTab';
import AddressesTab from '../components/account/AddressesTab';
import OrdersTab from '../components/account/OrdersTab';
import AccountInfoTab from '../components/account/AccountInfoTab';

const TABS = {
  profile: ProfileTab,
  security: SecurityTab,
  addresses: AddressesTab,
  orders: OrdersTab,
  account: AccountInfoTab,
};

const AccountPage = () => {
  const [params, setParams] = useSearchParams();

  const current = params.get('tab') || 'profile';

  const ActiveTab = TABS[current] || ProfileTab;

  const setTab = (tab) => {
    setParams({ tab });
  };

  return (
    <div className="min-h-screen bg-white px-4 md:px-8 xl:px-16 py-10">

      <div className="max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="mb-14">

          <p
            className="text-[12px]
                       uppercase
                       tracking-[0.18em]
                       font-semibold
                       text-[#777683]
                       mb-3"
          >
            Account Center
          </p>

          <h1
            className="text-4xl md:text-6xl
                       font-semibold
                       tracking-[-0.04em]
                       leading-[1.05]
                       text-[#191C1D]"
          >
            My Account
          </h1>

          <p
            className="mt-5
                       max-w-2xl
                       text-[16px]
                       leading-7
                       text-[#464652]"
          >
            Manage your profile, saved addresses,
            account security, and order history
            through a unified commerce experience.
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">

          <AccountSidebar
            current={current}
            onChange={setTab}
          />

          <main
            className="rounded-[10px]
                       bg-[#F8F9FA]
                       p-8 md:p-10
                       min-h-[700px]"
          >
            <ActiveTab />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;