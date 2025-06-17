# Project: Landscape Architecture - Kinetic Sand Topography Visualizer (UConn I3)

## Overview / Summary

This project, developed at UConn I3, was a proof-of-concept MVP (Minimum Viable Product) for a UConn researcher in the Landscape Architecture department. The goal was to create a tool for students to understand topographic maps by transforming 3D scans of kinetic sand landscapes (created in the classroom) into 2D topographic heatmaps. The project involved a complex pipeline utilizing iPhone LiDAR, C++, OpenGL, a Node.js with Express.js Web API, and a Vue.js web application with D3.js for visualization. This MVP was completed in 2024.

## Problem Statement & Objectives

*   **Problem:** Landscape architecture students needed a more intuitive and interactive way to learn about topology and understand how 3D forms translate to 2D topographic map representations.
*   **Objective 1:** Develop an MVP to prove the concept of using iPhone LiDAR to scan student-created kinetic sand models.
*   **Objective 2:** Create a data processing pipeline to convert the 3D scan data (STL files) into 2-dimensional matrices representing elevation data.
*   **Objective 3:** Build a web application to visualize these 2D matrices as interactive topographic heatmaps.
*   **Objective 4:** Deliver a workable MVP to the researcher to aid in securing further project funding and development.

## My Role & Key Contributions

*   **Role:** Co-Developer (Full-Stack)
*   **Contribution 1:** Collaborated on the design and implementation of the overall system architecture, bridging mobile scanning, 3D data processing, backend services, and frontend visualization.
*   **Contribution 2:** Contributed to the development of the Node.js/Express.js backend API, which served as the intermediary to process and transfer data from the C++/OpenGL backend to the Vue.js frontend.
*   **Contribution 3:** Worked on the Vue.js frontend application, including the integration of D3.js for rendering the 2D topographic heatmaps from the processed matrix data.
*   **Contribution 4:** Participated in problem-solving across the complex tech stack, involving interactions between the iPhone LiDAR SDK, C++ for 3D processing, and the web components.

## Technical Stack & Implementation Details

*   **Scanning:** iPhone LiDAR SDK
*   **3D Data Processing:** C++, OpenGL (for converting 3D STL objects to 2D matrices)
*   **Backend API:** Node.js, Express.js
*   **Frontend Visualization:** Vue.js, D3.js
*   **Version Control:** Git, GitHub (Project Repository: [github.com/uconndxlab/landscape-AR](https://github.com/uconndxlab/landscape-AR))

## Outcomes & Achievements

*   Successfully delivered a functional MVP that demonstrated the feasibility of the kinetic sand topography visualization concept.
*   The MVP played a key role in helping the UConn researcher secure an additional $10,000 grant for further project development.
*   The project is still actively undergoing development at UConn I3, building upon the foundation of the MVP.
*   Provided a unique and engaging way for students to learn about topographic mapping.

## Positive Impact / Learnings / Reflection

This project was a fascinating dive into a more complex, multi-stage data processing and visualization pipeline. As a co-developer, it was an incredible learning experience to work on an MVP that integrated technologies ranging from mobile 3D scanning with LiDAR to C++ and OpenGL for geometric processing, a Node.js/Express.js backend, and finally, intricate frontend data visualization with D3.js in Vue. The challenge of transforming a physical, 3D sand model into an interactive 2D digital heatmap was particularly rewarding. Collaborating with my co-developer and the researcher to bring this innovative educational tool to life was a highlight. Seeing our MVP directly contribute to securing further grant funding underscored the real-world impact of even initial proof-of-concept work. This project significantly broadened my understanding of 3D data handling and inter-language communication in a distributed system.

--- 