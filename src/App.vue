<script setup lang="ts">
// No imports needed for router-link and router-view
</script>

<template>
  <div id="app">
    <nav class="navigation">
      <div class="nav-brand">
        <h2>My Vue App</h2>
      </div>
      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/projects" class="nav-link">Projects</router-link>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navigation {
  background: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-brand h2 {
  margin: 0;
  color: #ecf0f1;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #ecf0f1;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: #34495e;
}

.nav-link.router-link-active {
  background-color: #3498db;
  font-weight: bold;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background: #f8f9fa;
}
</style>
