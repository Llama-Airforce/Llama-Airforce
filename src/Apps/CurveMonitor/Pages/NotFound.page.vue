<template>
  <div class="not-found">
    <div class="not-found-container">
      <Card>
        Where are you going, pilot? Page not found, please return home fren.
      </Card>

      <img src="@/Assets/404.png" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 2rem;

  > .not-found-container {
    display: flex;
    flex-direction: column;
    gap: 5rem;
    width: 50rem;

    img {
      width: 100%;
      max-width: 100%;
      object-fit: scale-down;
    }
  }
}
</style>
