<script setup lang="ts">
import * as Theme from 'main/Styles';
import { setUser, clearUser } from 'store/Store';
import { useDispath, useSelector } from './redux/helper';
import { ref } from 'vue';
import AddProduct from './components/Product/AddProduct/AddProduct.vue';

const dispath = useDispath();
const users = useSelector((state) => state.user);

const isAdd = ref(true);

const update = () => {
  dispath(setUser('ไอ้เหี้ย กว่าจะได้'));
};
</script>

<template>
  <div class="product-feature">
    <div class="menu">
      <select class="selector">
        <option selected>Manage: Product</option>
        <option>Category</option>
      </select>
      <div class="features">
        <div class="add" @click="isAdd = !isAdd">add product</div>
      </div>
    </div>
    <div class="list" v-if="!isAdd">
      <div>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>SKU</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>eiei</td>
              <td>SAU1101</td>
              <td>Test Product Na Kub</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="list" v-else>
      <AddProduct />
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* height: 100%; */
.product-feature {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  height: 100%;
  position: absolute;

  .menu {
    padding: 1.5rem 1.5rem;
    padding-bottom: 0;
    display: flex;
    justify-content: space-between;
    user-select: none;

    .selector {
      cursor: pointer;
      -moz-appearance: none;
      -webkit-appearance: none;
      appearance: none;
      display: inline-block;
      position: relative;
      padding: 0.5rem;
      font-size: 0.9rem;
      box-shadow: 0 0 0 1px v-bind(Theme.grey300);
      color: v-bind(Theme.textColor);
      background: v-bind(Theme.white);
      border-radius: v-bind(Theme.borderRadius);
    }

    .features {
      display: flex;
      gap: 0.5rem;
      .add {
        padding: 0.75rem;
        font-size: 0.9rem;
        font-weight: 300;
        text-transform: capitalize;
        cursor: pointer;
        border-radius: v-bind(Theme.borderRadius);
        background: v-bind(Theme.primary600);
        color: v-bind(Theme.white);

        &:hover {
          background: v-bind(Theme.primary500);
        }
      }
    }
  }

  .list {
    width: 100%;
    height: 100%;
    position: relative;
  }
}
</style>
