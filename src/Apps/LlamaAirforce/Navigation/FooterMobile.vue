<template>
  <footer class="footer-mobile">
    <nav class="support">
      <ul>
        <li>
          <a
            class="nav-link"
            href="https://docs.llama.airforce/"
            target="_blank"
          >
            <div class="nav-link-container icon">
              <i class="fas fa-book"></i>
            </div>
          </a>
        </li>

        <li>
          <a
            class="nav-link"
            href="https://medium.com/@llamaairforce"
            target="_blank"
          >
            <div class="nav-link-container icon">
              <i class="fas fa-bullhorn"></i>
            </div>
          </a>
        </li>

        <li>
          <a
            class="nav-link"
            href="https://discord.gg/E3KHXkvzPJ"
            target="_blank"
          >
            <div class="nav-link-container icon">
              <i class="fab fa-discord"></i>
            </div>
          </a>
        </li>

        <li>
          <a
            class="nav-link"
            href="https://twitter.com/0xAlunara"
            target="_blank"
          >
            <div class="nav-link-container icon">
              <i class="fab fa-twitter"></i>
            </div>
          </a>
        </li>

        <li>
          <router-link
            to="/code"
            class="nav-link"
          >
            <div class="nav-link-container icon">
              <i class="fas fa-code"></i>
            </div>
          </router-link>
        </li>
      </ul>
    </nav>
  </footer>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
@import "@/Styles/Hamburger.scss";

footer {
  display: flex;
  margin: 0rem 1rem 2rem 1rem;
  justify-content: center;

  nav {
    ul {
      display: flex;
      gap: 1rem;
      padding: 0;
      margin: 0;
      list-style-type: none;

      li {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-right: 0.5rem;
        padding-left: 0.5rem;

        .nav-link {
          height: 2rem;
          display: flex;
          justify-content: center;
          text-decoration: none;
          color: var(--c-text);
          border-bottom: $header-highlight-size solid $header-background;
          transition: all $header-hover-duration;

          .nav-link-container {
            display: flex;
            flex-grow: 1;
            justify-content: center;
            align-items: center;
            padding: 0 0.5rem;

            border-bottom: $header-highlight-size solid transparent; // Empty bar to prevent stuff jumping around.
            transition: all $header-hover-duration;
          }

          &.disabled {
            opacity: 0.15;
            pointer-events: none;
          }

          &:hover:not(.disabled) {
            border-bottom: $header-highlight-size solid $header-primary;

            .nav-link-container {
              background-color: $header-button-hover;
              border-bottom: 1px solid $header-primary;
              color: $header-primary;
            }
          }

          &:active:not(.disabled) {
            .nav-link-container {
              background-color: $header-button-focus;
            }
          }
        }
      }
    }
  }
}
</style>
