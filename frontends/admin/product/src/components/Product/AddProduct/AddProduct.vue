<script setup lang="ts">
import * as Theme from 'main/Styles';
</script>

<template>
  <div class="add-product">
    <div class="add-product__form hide-scroll">
      <div class="form-card">
        <h6>Basic Information</h6>
        <div class="form-input">
          <input type="text" required />
          <label>product name *</label>
        </div>
        <div class="form-input text-area">
          <textarea required></textarea>
          <label>description</label>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="form-dropdown">
            <span>select category</span>
            <v-icon name="bi-chevron-down" class="dropdown__icon" />
          </div>
          <div class="form-dropdown --disable">
            <span>select sub-category</span>
            <v-icon name="bi-chevron-down" class="dropdown__icon" />
          </div>
          <div class="form-dropdown">
            <span>select brand</span>
            <v-icon name="bi-chevron-down" class="dropdown__icon" />
          </div>
          <div class="form-input">
            <input type="text" required />
            <label>price</label>
          </div>
        </div>
      </div>
      <div class="form-card">
        <h6>Product Image</h6>
        <div class="form-image">
          <div class="form-image__drop">
            <v-icon name="io-images" class="drop-image__icon" />
            <span>Drop files or click to upload.</span>
          </div>
          <input
            type="file"
            multiple
            name="files"
            ref="file"
            accept=".jpg,.jpeg,.png"
          />
        </div>
      </div>
      <div class="form-card">
        <h6>stock & pricing</h6>
        <div class="form-input">
          <input type="text" required />
          <label>price</label>
        </div>
      </div>
    </div>
    <div class="add-product-action">
      <div class="button">discard</div>
      <div class="button --save">save changes</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.add-product {
  user-select: none;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  .add-product__form {
    border-radius: v-bind(Theme.borderRadius);
    width: 100%;
    padding: 0 1.5rem;
    overflow: scroll;
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: masonry;
    gap: 1rem;

    .form-card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: v-bind(Theme.white);
      border-radius: v-bind(Theme.borderRadius);
      padding: 1.5rem;

      h6 {
        text-transform: capitalize;
      }
    }
  }

  .add-product-action {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    gap: 1rem;
    background: v-bind(Theme.white);
    padding: 1.5rem;

    .button {
      cursor: pointer;
      background: v-bind(Theme.grey100);
      padding: 0.8rem;
      text-transform: capitalize;
      border-radius: v-bind(Theme.borderRadius);
      font-size: 0.9rem;
      font-weight: 300;

      &:hover {
        background: v-bind(Theme.grey200);
      }

      &.--save {
        background: v-bind(Theme.primary600);
        color: v-bind(Theme.white);

        &:hover {
          background: v-bind(Theme.primary500);
        }
      }
    }
  }
}
</style>
