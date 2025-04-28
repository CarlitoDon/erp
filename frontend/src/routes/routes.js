// src/routes/routes.js

const routes = [
  // Rute Autentikasi (Publik)
  {
    path: "login",
    component: "Login",
    isPrivate: false,
    showInSidebar: false,
    title: "Login",
  },
  {
    path: "register",
    component: "Register",
    isPrivate: false,
    showInSidebar: false,
    title: "Register",
  },

  // Rute Utama Aplikasi (Private)
  {
    path: "dashboard",
    component: "Dashboard",
    icon: "Dashboard",
    isPrivate: true,
    showInSidebar: true,
    title: "Dashboard",
  },
  {
    path: "sales",
    component: "Sales",
    icon: "LocalShipping",
    isPrivate: true,
    showInSidebar: true,
    title: "Sales Management",
    children: [
      {
        path: "acquisition",
        component: "Acquisition",
        showInSidebar: true,
        title: "Sales Acquisition",
        children: [
          {
            path: "input-order",
            component: "InputOrderAcquisition",
            title: "Input Order (Acquisition)",
          },
          {
            path: "lead",
            component: "LeadManagement",
            title: "Lead Management",
          },
          {
            path: "campaign",
            component: "CampaignMarketing",
            title: "Campaign Marketing",
          },
          {
            path: "analytics",
            component: "SalesAnalytics",
            title: "Sales Analytics",
          },
        ],
      },
      {
        path: "retention",
        component: "Retention",
        showInSidebar: true,
        title: "Sales Retention",
        children: [
          {
            path: "input-order",
            component: "InputOrderRetention",
            title: "Input Order (Retention)",
          },
          {
            path: "loyalty",
            component: "LoyaltyProgram",
            title: "Loyalty Program",
          },
          {
            path: "followup",
            component: "CustomerFollowUp",
            title: "Customer Follow Up",
          },
          {
            path: "feedback",
            component: "FeedbackManagement",
            title: "Feedback Management",
          },
        ],
      },
      {
        path: "marketplace",
        component: "Marketplace",
        showInSidebar: true,
        title: "Marketplace Sales",
        children: [
          {
            path: "input-order",
            component: "InputOrderMarketplace",
            title: "Input Order (Marketplace)",
            children: [
              {
                path: "shopee",
                component: "ImportShopeeOrder",
                title: "Import Order (Shopee)",
              },
              {
                path: "tokopedia",
                component: "ImportTokopediaOrder",
                title: "Import Order (Tokopedia)",
              },
              {
                path: "tiktokshop",
                component: "ImportTiktokshopOrder",
                title: "Import Order (TikTok Shop)",
              },
            ],
          },
          {
            path: "integration",
            component: "MarketplaceIntegration",
            title: "Marketplace Integration",
          },
          {
            path: "analytics",
            component: "MarketplacePerformanceAnalysis",
            title: "Marketplace Performance",
          },
          {
            path: "products",
            component: "MarketplaceProductSettings",
            title: "Marketplace Product Settings",
          },
        ],
      },
    ],
  },
  {
    path: "customer",
    component: "Customer",
    icon: "Group",
    isPrivate: true,
    showInSidebar: true,
    title: "Customer Management",
    children: [
      {
        path: "data",
        component: "CustomerData",
        showInSidebar: true,
        title: "Customer Data",
      },
      {
        path: "segmentation",
        component: "CustomerSegmentation",
        showInSidebar: true,
        title: "Customer Segmentation",
      },
      {
        path: "transactions",
        component: "TransactionHistory",
        showInSidebar: true,
        title: "Transaction History",
      },
      {
        path: "communication",
        component: "Communication",
        showInSidebar: true,
        title: "Communication Log",
      },
      {
        path: "ticket",
        component: "SupportTicket",
        showInSidebar: true,
        title: "Support Tickets",
      },
    ],
  },
  {
    path: "product",
    component: "Product",
    icon: "Store",
    isPrivate: true,
    showInSidebar: true,
    title: "Product Management",
    children: [
      {
        path: "catalog",
        component: "ProductCatalog",
        showInSidebar: true,
        title: "Product Catalog",
      },
      {
        path: "categories",
        component: "ProductCategories",
        showInSidebar: true,
        title: "Product Categories",
      },
      {
        path: "suppliers",
        component: "SupplierManagement",
        showInSidebar: true,
        title: "Supplier Management",
      },
      {
        path: "pricing",
        component: "PricingManagement",
        showInSidebar: true,
        title: "Pricing Management",
      },
    ],
  },
  {
    path: "warehouse",
    component: "Warehouse",
    icon: "Inventory",
    isPrivate: true,
    showInSidebar: true,
    title: "Warehouse Management",
    children: [
      {
        path: "orders",
        component: "Orders",
        showInSidebar: true,
        title: "Warehouse Orders",
        children: [
          {
            path: "processing",
            component: "OrderProcessing",
            title: "Order Processing",
          },
          {
            path: "tracking",
            component: "OrderTracking",
            title: "Order Tracking",
          },
          {
            path: "refund",
            component: "ReturnsAndRefunds",
            title: "Returns & Refunds",
          },
        ],
      },
      {
        path: "stock",
        component: "Stock",
        showInSidebar: true,
        title: "Stock Management",
        children: [
          {
            path: "inventory",
            component: "InventoryManagement",
            title: "Inventory Management",
          },
          {
            path: "restock",
            component: "RestockAlert",
            title: "Restock Alerts",
          },
          {
            path: "adjustment",
            component: "StockAdjustment",
            title: "Stock Adjustments",
          },
        ],
      },
      {
        path: "shipping",
        component: "Shipping",
        showInSidebar: true,
        title: "Shipping Management",
        children: [
          {
            path: "providers",
            component: "ShippingProviders",
            title: "Shipping Providers",
          },
          {
            path: "tracking",
            component: "ShippingTracking",
            title: "Shipping Tracking",
          },
          {
            path: "labels",
            component: "ShippingLabels",
            title: "Shipping Labels",
          },
        ],
      },
    ],
  },
  {
    path: "finance",
    component: "Finance",
    icon: "Paid",
    isPrivate: true,
    showInSidebar: true,
    title: "Finance",
    children: [
      {
        path: "invoices",
        component: "Invoices",
        showInSidebar: true,
        title: "Invoices",
      },
      {
        path: "payments",
        component: "Payments",
        showInSidebar: true,
        title: "Payments",
      },
      {
        path: "reports",
        component: "FinancialReports",
        showInSidebar: true,
        title: "Financial Reports",
      },
      {
        path: "expenses",
        component: "Expenses",
        showInSidebar: true,
        title: "Expenses",
      },
      {
        path: "taxes",
        component: "Taxes",
        showInSidebar: true,
        title: "Taxes",
      },
    ],
  },
  {
    path: "reports",
    component: "Reports",
    icon: "Assessment",
    isPrivate: true,
    showInSidebar: true,
    title: "Reports",
    children: [
      {
        path: "sales",
        component: "SalesAnalysis",
        showInSidebar: true,
        title: "Sales Analysis Report",
      },
      {
        path: "profit",
        component: "ProfitReports",
        showInSidebar: true,
        title: "Profit Reports",
      },
      {
        path: "products",
        component: "ProductPerformanceReports",
        showInSidebar: true,
        title: "Product Performance",
      },
      {
        path: "suppliers",
        component: "SupplierReports",
        showInSidebar: true,
        title: "Supplier Reports",
      },
    ],
  },
  {
    path: "settings",
    component: "Settings",
    icon: "Settings",
    isPrivate: true,
    showInSidebar: true,
    title: "Settings", // Judul bagian Settings
    children: [
      {
        path: "profile",
        component: "BusinessProfile",
        showInSidebar: true,
        title: "Business Profile",
      },
      {
        path: "users",
        component: "UserManagement",
        showInSidebar: true,
        title: "User Management",
      }, // Perhatikan ada duplikat nama komponen, title membedakan
      {
        path: "api",
        component: "APIIntegration",
        showInSidebar: true,
        title: "API Integration",
      },
      {
        path: "notifications",
        component: "Notifications",
        showInSidebar: true,
        title: "Notifications",
      },
    ],
  },
];

export default routes;
