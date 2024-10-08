import {
  FiGrid,
  FiUsers,
  FiCompass,
  FiSettings,
  FiSlack,
} from "react-icons/fi";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

import {GrTransaction} from "react-icons/gr"

/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const sidebar = [
  {
    path: "/dashboard", // the url
    icon: FiGrid, // icon
    name: "Dashboard", // name that appear in Sidebar
  },

  {
    icon: FiSlack,
    name: "Catalog",
    routes: [
      {
        path: "/products",
        name: "Products",
      },
      {
        path: "/categories",
        name: "Categories",
      },
      {
        path: "/gift-cards",
        name: "Gift cards",
      },
      {
        path: "/coupons",
        name: "Promos",
      },
    ],
  },
  {
    icon: GrTransaction,
    name: "Transactions",
    routes: [
      {
        path: "/transactions",
        name: "Orders",
      },
      {
        path: "/transactions/gift-cards",
        name: "Gift cards",
      },
      {
        path: "/transactions/wallets",
        name: "Wallets",
      },
      {
        path: "/transactions/payment-proofs",
        name: "Payment Proofs",
      },
    ],
  },

  {
    path: "/customers",
    icon: FiUsers,
    name: "Customers",
  },
  {
    path: "/orders",
    icon: FiCompass,
    name: "Orders",
  },

  // {
  //   path: "/our-staff",
  //   icon: FiUser,
  //   name: "OurStaff",
  // },

  {
    path: "/support",
    icon: IoChatbubbleEllipsesOutline,
    name: "Suport / Chat",
  },

  {
    path: "/settings",
    icon: FiSettings,
    name: "StoreSetting",
  },
  // {
  //   icon: FiGlobe,
  //   name: "International",
  //   routes: [
  //     {
  //       path: "/languages",
  //       name: "Languages",
  //     },
  //     {
  //       path: "/currencies",
  //       name: "Currencies",
  //     },
  //   ],
  // },
  // {
  //   icon: FiTarget,
  //   name: "ViewStore",
  //   path: "http://localhost:3000",
  //   outside: "store",
  // },

  // {
  //   icon: FiSlack,
  //   name: "Pages",
  //   routes: [
  //     // submenu

  //     {
  //       path: "/404",
  //       name: "404",
  //     },
  //     {
  //       path: "/coming-soon",
  //       name: "Coming Soon",
  //     },
  //   ],
  // },
];

export default sidebar;
