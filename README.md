
# 📚 NITC Marketplace

A student-driven platform exclusively for **NITC students** to **buy and sell items**, and to help with **lost and found** items on campus. This platform is built with secure login, restricted only to users with **@nitc.ac.in** emails.

---

## 🚀 Features

- ✅ **Secure Login & Signup** — Only accessible with **NITC email IDs** (`@nitc.ac.in`).
- ✅ **Buy & Sell Marketplace** — Post items for sale or browse listings.
- ✅ **Lost and Found** — Report or claim lost items on campus.
- ✅ **Admin Dashboard**
  - Approve or reject item listings.
  - Enable, disable, or delete users.
  - View category-wise item summaries.
- ✅ **Dark Mode** — Seamless light/dark theme toggle for better user experience.
- ✅ **Responsive Design** — Mobile, tablet, and desktop-friendly interface.

---

## 🛠️ Admin Dashboard Features

- 🔑 **User Management**
  - Enable, disable, or permanently delete users.
- 📄 **Item Approval**
  - Admin approval is mandatory before any item or post appears on the platform.
- 📊 **Category Summary**
  - View the total number of items in each category (e.g., Books, Electronics, Lost Items).
- 🛠️ **Feedback Management**
  - Review and manage feedback from users.
- 🌓 **Dark Mode for Admin Panel** — Fully responsive and theme-aware.

---

## 🏗️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript (React.js)
- **Backend:** Python Flask
- **Database:** MySQL
- **Authentication:** Email-based (restricted to `@nitc.ac.in` domain)

---

## 🔐 Authentication Rules

- Only **@nitc.ac.in** email addresses are allowed for signup/login.
- Verification is enforced to prevent unauthorized access.

---

## 🛒 Categories

1. **Buy and Sell**
   - Books, Electronics, Cycles, Furniture, Hostel Items, etc.
2. **Lost and Found**
   - Report or claim items lost or found around the campus.

---

## 📦 Installation

### Clone the Repository:

```bash
git clone https://github.com/kotireddy712/NITC-MarketPlace
cd nitc-marketplace
```

### Install Dependencies:

```bash
pip install -r requirements.txt   # For Flask backend
# OR
npm install                       # For Node backend
```

### Set Up Environment Variables:

- Configure environment variables like email credentials, database URLs, secret keys, etc.

### Run the Project:

```bash
# For Flask
python app.py

# For Node
npm start
```

Open the browser at https://nitc-marketplace.netlify.app

---

## 📱 Screenshots

- ✅ Login & Signup (with NITC email validation)
- ✅ User Dashboard (Buy & Sell, Lost & Found)
- ✅ Search filters and sorting.
- ✅ Admin Dashboard (User management, item approvals)
- ✅ Dark Mode enabled UI


---

## 🚀 Future Improvements

- ✅ Chat or messaging between buyers and sellers.
- ✅ Push notifications for lost items matching found items.
- ✅ Mobile App (optional future upgrade).

---

## 🤝 Contribution

Contributions are welcome! Please fork this repository and submit a pull request.

---

## 🏫 Made with ❤️ for the students of **NIT Calicut (NITC)**.

