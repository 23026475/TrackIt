import { createRouter, createWebHistory } from "vue-router";
import Projects from "../pages/Projects.vue";
import SprintBoard from "../pages/SprintBoard.vue";
import KanbanPage from "../pages/KanbanPage.vue";
import ThemeSelector from "../pages/ThemeSelector.vue";
import Account from "../pages/Account.vue";
import ProgressBoard from "../pages/ProgressBoard.vue";
import AuthPage from "../pages/Auth.vue";
import { auth } from '../firebaseConfig'; // Ensure you have Firebase auth imported
import Login from "../components/Login.vue";

const routes = [
  {
    path: '/auth',
    name: 'Auth',
    component: AuthPage,
  },
  {
    path: '/',
    name: 'Projects',
    component: Projects,
    meta: { requiresAuth: true }, // Protect this page
  },
  {
    path: '/sprintboard',
    name: 'Sprint Board',
    component: SprintBoard,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Log In',
    component: Login,
    meta: { requiresAuth: true },
  },
  {
    path: '/kanban',
    name: 'Kanban Board',
    component: KanbanPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/progressboard',
    name: 'Project Progress',
    component: ProgressBoard,
    meta: { requiresAuth: true },
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    meta: { requiresAuth: true },
  },
  {
    path: '/themeselector',
    name: 'Theme Selector',
    component: ThemeSelector,
    meta: { requiresAuth: true },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard to handle authentication
router.beforeEach((to, from, next) => {
  const user = auth.currentUser;
  
  if (to.meta.requiresAuth && !user) {
    next('/auth'); // Redirect to Auth page if not logged in
  } else if (to.path === '/auth' && user) {
    next('/'); // If already logged in, redirect to Projects page
  } else {
    next();
  }
});

export default router;
