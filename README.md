# ResumeForge ✨

## 🚀 Overview

ResumeForge is a cutting-edge SaaS-style web application designed to revolutionize the way candidates evaluate and present their technical profiles. By seamlessly integrating with **GitHub** and **LeetCode**, ResumeForge fetches and analyzes data, calculates unified skill scores, and delivers personalized insights to help users understand their strengths and areas for improvement. Generate polished, branded PDF reports to showcase your analytical profile to potential employers or for personal progress tracking.

Whether you're a student, a seasoned developer, or a hiring manager, ResumeForge provides objective metrics and visual reports to empower informed decisions.

## ✨ Features

  * **Unified Skill Scoring:** Combines data from GitHub (contributions, repositories, languages) and LeetCode (solved problems, difficulty distribution) to generate a comprehensive, unified score.
  * **Personalized Insights:** Displays detailed breakdowns of your performance across platforms, highlighting key strengths and areas needing attention.
  * **Supabase Edge Functions for CORS:** Efficiently proxies all LeetCode and sync requests through Supabase Edge Functions, gracefully handling CORS restrictions with proper OPTIONS handling and headers.
  * **Secure Profile Management:**
  * **Professional PDF Report Generation:** Download polished, branded analysis reports generated with `jsPDF` instead of raw JSON data, perfect for sharing.
  * **Robust Backend with PostgREST:** Utilizes PostgREST for efficient API interactions, with seamless schema cache reloading to support new columns.
  * **Modern UX & Responsiveness:**
      * Elegant Dark Mode support for comfortable viewing.
      * Fully responsive design ensuring a smooth experience across all devices.
      * Clean and intuitive user interface.
        

## ⚙️ Tech Stack

  * **Frontend:** React (or similar, based on `bolt.new` setup)
  * **Backend/Database:** Supabase (PostgreSQL, Authentication, Storage, Edge Functions)
  * **API Layer:** PostgREST (via Supabase)
  * **PDF Generation:** `jsPDF`
  * **Styling:** Tailwind CSS
  * **Deployment:** Vercel 

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

  * Node.js (v18+)
  * npm or yarn
  * A Supabase project (with your database schema, storage buckets, and Edge Functions set up)
  * GitHub OAuth App credentials
  * LeetCode (or other external API) credentials, if applicable for direct fetching (though proxied via Edge Functions)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/RitamPal26/ResumeForge.git
    cd ResumeForge
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add your Supabase credentials and other necessary environment variables:

    ```
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID
    GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET
    # Add any other required environment variables for LeetCode integration or other services
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) (or your configured port) in your browser.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## Pictures

<img width="824" alt="image" src="https://github.com/user-attachments/assets/362c5546-d761-4584-952b-9925f89b5c23" />

-----

<img width="791" alt="image" src="https://github.com/user-attachments/assets/2d97a328-12a7-4e91-938e-f75a41c2955d" />

-----

<img width="776" alt="image" src="https://github.com/user-attachments/assets/127b74f6-50e1-4038-8e61-30842d165198" />

-----

<img width="785" alt="image" src="https://github.com/user-attachments/assets/6b6120f2-4c7b-40d8-aa89-2826ce59a9fc" />

-----

<img width="768" alt="image" src="https://github.com/user-attachments/assets/f693d095-0e44-44f0-9e6a-94fed5dd4456" />

-----

<img width="784" alt="image" src="https://github.com/user-attachments/assets/7e4837bb-f7ed-46c1-8d21-ea3968f179f7" />

-----

<img width="764" alt="image" src="https://github.com/user-attachments/assets/1d300e2b-6de4-4ef6-950a-97dfbb9ed5fc" />


-----




