import { createRouter, createWebHistory } from "vue-router";
import Projects from "/src/pages/Projects.vue";
import SprintBoard from "/src/pages/SprintBoard.vue";
import KanbanPage from "/src/pages/KanbanPage.vue";
import ThemeSelector from "/src/pages/ThemeSelector.vue";
import Account from "/src/pages/Account.vue";
import ProgressBoard from "/src/pages/ProgressBoard.vue";

const routes = [
  {
    path: '/',
    name: 'Projects',
    component: Projects,
  },
  {
    path: '/sprintboard',
    name: 'Sprint Board',
    component: SprintBoard,
  },
  {
    path: '/kanban',
    name: 'Kanban Board',
    component: KanbanPage,
  },
  {
    path: '/progressboard',
    name: 'Project Progress',
    component: ProgressBoard,
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
  },
  {
    path: '/themeselector',
    name: 'Theme Selector',
    component: ThemeSelector,
  }
];

const router = createRouter({
  history: createWebHistory(), // <-- Removed process.env.BASE_URL
  routes,
});

export default router;
