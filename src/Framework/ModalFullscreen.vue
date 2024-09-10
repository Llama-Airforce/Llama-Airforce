<script setup lang="ts">
/**
 * This component takes an existing HTML element, removes it from its original container,
 * and places it inside a fullscreen modal. When the modal is closed, the element is
 * returned to its original position in the DOM.
 */

const { target } = defineProps<{
  target: HTMLElement | null;
}>();

const emit = defineEmits<{
  enterBefore: [modal: HTMLElement];
  enter: [modal: HTMLElement];
  exitBefore: [modal: HTMLElement];
  exit: [modal: HTMLElement];
}>();

// Fullscreen handling
const modalRef = useTemplateRef<HTMLElement>("modal");

let targetParent: HTMLElement | null = null;
let targetNextSibling: Node | null = null;

// Watch for changes in the modal rendering to handle the element's transition to and from fullscreen.
watch(modalRef, (newModal, oldModal) => {
  // Exit if the target element is not available.
  if (!target) {
    return;
  }

  // Handle the element's transition to fullscreen mode when the modal is rendered.
  if (newModal) {
    enterFullscreen(target, newModal);
  }

  // Handle the element's transition out of fullscreen mode when the modal is removed.
  else if (oldModal && targetParent) {
    exitFullscreen(target, targetParent, oldModal);
  }
});

function enterFullscreen(target: Node, modal: HTMLElement) {
  targetParent = target.parentNode as HTMLElement | null;
  targetNextSibling = target.nextSibling;

  // Remove the target element from its original container.
  if (targetParent) {
    emit("enterBefore", modal);

    targetParent.removeChild(target);

    // Append the target element to the fullscreen modal.
    modal.appendChild(target);

    emit("enter", modal);
  }
}

function exitFullscreen(
  target: Node,
  targetParent: HTMLElement,
  modal: HTMLElement
) {
  emit("exitBefore", modal);

  // Remove the target element from the modal.
  modal.removeChild(target);

  // Reattach the target element to its original position in the DOM.
  if (targetNextSibling) {
    targetParent.insertBefore(target, targetNextSibling);
  } else {
    targetParent.appendChild(target);
  }

  emit("exit", modal);
}
</script>

<template>
  <Modal>
    <div
      ref="modal"
      class="fullscreen-content"
    ></div>
  </Modal>
</template>

<style scoped>
.fullscreen-content {
  display: flex;

  width: 80dvw;
  width: 80vw;
  height: 80dvh;
  height: 80vh;

  /** Helpful style in conjuction with ModalFullscreen, esp for charts. */
  --card-width: 100%;
  --card-body-height: 100%;
  --card-body-overflow: hidden;
}
</style>
