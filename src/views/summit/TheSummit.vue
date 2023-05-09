<script lang="ts" setup>
import { ref } from 'vue';
import SummitSchedule from './components/SummitSchedule.vue';
import AppEditTemplate from '@/components/AppEditTemplate.vue';

const showIndex = ref(1);
function setShowIndex(index: number) {
  showIndex.value = index;
}
</script>
<template>
  <AppEditTemplate>
    <div class="edit-summit">
      <h3>会议日程</h3>
      <div class="date">
        <div
          class="date-item"
          :class="{ active: showIndex === 0 }"
          @click="setShowIndex(0)"
        >
          <p class="date-day">20</p>
          <p class="date-month">APRIL</p>
        </div>
        <div
          class="date-item"
          :class="{ active: showIndex === 1 }"
          @click="setShowIndex(1)"
        >
          <p class="date-day">21</p>
          <p class="date-month">APRIL</p>
        </div>
      </div>
      <div v-show="showIndex === 0">
        <SummitSchedule schedule-name="schedule-20" />
      </div>
      <div v-show="showIndex === 1">
        <SummitSchedule schedule-name="schedule" />
      </div>
    </div>
  </AppEditTemplate>
</template>

<style scoped lang="scss">
.edit-summit {
  position: relative;
  z-index: 11;
  padding: var(--o-gap-7) 0;
  display: flex;
  flex-direction: column;
  max-width: 1504px;
  padding: var(--o-spacing-h2) var(--o-spacing-h2) var(--o-spacing-h1);
  margin: 0 auto;
  @media (max-width: 1680px) {
    max-width: 1300px;
  }
  h3 {
    position: relative;
    text-align: center;
    font-size: var(--o-font-size-h3);
    line-height: var(--o-line-height-h3);
    color: var(--o-color-text1);
    font-weight: 300;
  }
  .date {
    display: flex;
    justify-content: center;
    margin-top: 24px;
    .date-item {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #cbcbcb;
      border-radius: 8px;
      border: 1px solid #cbcbcb;
      transition: all 0.3s ease-out;

      & ~ div {
        margin-left: 40px;
      }
      &.active {
        color: #fff;
        background-color: var(--o-color-brand1);
        border: 1px solid #fff;
      }
      .date-day {
        padding: 13px 17px 3px 15px;
        line-height: 48px;
        font-size: 48px;
        font-weight: 700;
        border-bottom: 1px solid #cbcbcb;
        @media screen and (max-width: 1120px) {
          padding: 6px 16px;
          font-size: 32px;
          line-height: 32px;
        }
      }
      .date-month {
        padding: 6px 0;
        font-size: 24px;
        font-weight: 100;
        line-height: 24px;
        @media screen and (max-width: 1120px) {
          padding: 4px 0;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
