<script lang="ts" setup>
import { ref, onUnmounted, Ref, inject, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import draggable from 'vuedraggable';

import { onBeforeRouteLeave } from 'vue-router';
import { modifyFloorData, getSingleFloorData } from '@/api/api-easy-edit';

import data from '@/data';

import OIcon from '@/components/OIcon.vue';
import { OButton } from '@/components/button';

import IconAdd from '~icons/app/icon-add.svg';
import IconTime from '~icons/app/icon-time.svg';
import IconWarn from '~icons/edit/icon-warn.svg';
import IconLinkDefault from '~icons/edit/icon-link-default.svg';
import IconLinkFilled from '~icons/edit/icon-link-filled.svg';

import { usePageData } from '@/stores';
export type TimerType = NodeJS.Timeout;

const { locale } = useI18n();

const modeType = inject('modeType') as Ref<boolean>;

const isEditStyle = computed(() => {
  return !modeType.value;
});

const props = defineProps({
  scheduleName: {
    type: String,
    default: '',
  },
});

const scheduleData = ref(
  usePageData().pageData.get(props.scheduleName)?.content
    ? JSON.parse(usePageData().pageData.get(props.scheduleName).content)
    : data
);

const dialogTopicTitle = ref('');

const dialogTopicContnet = ref('');

const isInputFocus = ref(false);
watch(
  () => usePageData().pageData.get(props.scheduleName),
  () => {
    scheduleData.value = JSON.parse(
      usePageData().pageData.get(props.scheduleName).content
    );
  },
  {
    deep: true,
  }
);
watch(
  () => scheduleData.value,
  () => {
    usePageData().pageData.get(props.scheduleName).content = JSON.stringify(
      scheduleData.value
    );
  },
  {
    deep: true,
  }
);
const param = {
  content: '',
  name: props.scheduleName,
  description: '',
  path: 'https://www.openeuler.org/zh/interaction/summit-list/devday2023/',
  title: '',
  isPrivate: false,
  type: 'event',
  locale: locale.value,
  contentType: 'application/json;charset=UTF-8',
};

onMounted(() => {
  // focus 状态禁止拖动。防止无法选中输入框内容
  document.addEventListener('click', function () {
    isInputFocus.value =
      document.querySelector('.edit-summit :focus-within') !== null;
  });
});

const delRowDialogVisiable = ref(false);

const delTabDialogVisiable = ref(false);

const agendaDialogVisiable = ref(false);

const delIndex = ref(0);
// 控制分论坛的详情弹窗显示
const indexShow = ref(-1);
const idShow = ref(-1);
function changeIndexShow(id: number, index: number) {
  idShow.value = id;
  indexShow.value = index;
}
// 控制主论坛及各个分论坛的显示
const tabType = ref(0);

const otherTabType = ref([0, 0, 0, 0, 0, 0, 0]);

// function tabClick() {
//   otherTabType.value[tabType.value] = 0;
// }

// function addSubtitle() {
//   scheduleData.value.content.push({
//     lable: '',
//     id: window.crypto.randomUUID(),
//     content: [
//       {
//         id: window.crypto.randomUUID(),
//         name: '',
//         content: [
//           {
//             id: window.crypto.randomUUID(),
//             time: ['', ''],
//             desc: '',
//             person: [
//               {
//                 id: window.crypto.randomUUID(),
//                 name: '',
//                 post: '',
//               },
//             ],
//             detail: '',
//           },
//         ],
//       },
//     ],
//   });
// }
// function delSubtitle(index: number) {
//   scheduleData.value.content.splice(index, 1);
//   tabType.value = 0;
// }
// 增加一行表格
function addContent() {
  scheduleData.value.content[tabType.value].content[
    otherTabType.value[tabType.value]
  ].content.push({
    time: '',
    desc: '',
    person: [
      {
        name: '',
        post: '',
        id: `id${
          scheduleData.value.content[tabType.value].content[
            otherTabType.value[tabType.value]
          ].content.length
        }`,
      },
    ],
    detail: '',
    id: `id${
      scheduleData.value.content[tabType.value].content[
        otherTabType.value[tabType.value]
      ].content.length
    }`,
  });
}
// 删除一行表格
function delContent(index: number) {
  delIndex.value = index;
  toggleDelDlg(true);
}
// 新增附属信息
function addPersonData(index: number) {
  scheduleData.value.content[tabType.value].content[
    otherTabType.value[tabType.value]
  ].content[index].person.push({
    name: '',
    post: '',
    id: window.crypto.randomUUID(),
  });
}
// 删除附属信息
function delPersonData(subIndex: number, personIndex: number) {
  if (
    scheduleData.value.content[tabType.value].content[
      otherTabType.value[tabType.value]
    ].content[subIndex].person.length === 1
  ) {
    scheduleData.value.content[tabType.value].content[
      otherTabType.value[tabType.value]
    ].content[subIndex].person[0] = {
      id: window.crypto.randomUUID(),
      name: '',
      post: '',
    };
  } else {
    scheduleData.value.content[tabType.value].content[
      otherTabType.value[tabType.value]
    ].content[subIndex].person.splice(personIndex, 1);
  }
}
// 确认删除一行
function confirmDelContent() {
  scheduleData.value.content[tabType.value].content[
    otherTabType.value[tabType.value]
  ].content.splice(delIndex.value, 1);
  toggleDelDlg(false);
}
// 确认删除分论坛标题
function confirmDelTab() {
  if (
    delIndex.value === 0 &&
    scheduleData.value.content[tabType.value].content.length === 1
  ) {
    scheduleData.value.content[tabType.value].content = [];
  } else {
    scheduleData.value.content[tabType.value].content.splice(delIndex.value, 1);
  }

  otherTabType.value[tabType.value] =
    delIndex.value === 0 ? 0 : delIndex.value - 1;
  toggleDelTabDlg(false);
}
// 删除分论坛标题
function delSubtitle2(index: number) {
  delIndex.value = index;
  toggleDelTabDlg(true);
}
// 增加分论坛标题
function addSubtitle2() {
  scheduleData.value.content[tabType.value].content.push({
    id: window.crypto.randomUUID(),
    name: '',
    content: [
      {
        id: window.crypto.randomUUID(),
        time: '',
        desc: '',
        person: [
          {
            id: window.crypto.randomUUID(),
            name: '',
            post: '',
          },
          {
            id: window.crypto.randomUUID(),
            name: '',
            post: '',
          },
        ],
        detail: '',
      },
    ],
  });
  const index = scheduleData.value.content[tabType.value].content.length;
  otherTabType.value[tabType.value] = index === 0 ? 0 : index - 1;
}
// 保存页面数据
function savePageData() {
  // if (props.scheduleName === 'schedule') {
  //   param.content = data.content;
  // } else {
  //   param.content = data.content1;
  // }
  param.content = JSON.stringify(scheduleData.value);
  modifyFloorData(param)
    .then((res: { statusCode: number }) => {
      if (res?.statusCode !== 200) {
        // 修改出错内容回显
        getSingleFloorData(param.path, param.name).then((res: any) => {
          param.content = res?.data?.content;
          param.title = res?.data?.title;
          usePageData().pageData.set(param.name, param);
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
let timer: TimerType;

// 定时保持页面
timer = setInterval(() => {
  savePageData();
}, 8 * 60 * 1000);

watch(
  () => modeType.value,
  (val) => {
    if (val) {
      savePageData();
      clearInterval(timer);
    } else {
      timer = setInterval(() => {
        savePageData();
      }, 8 * 60 * 1000);
    }
  }
);
function toggleDelDlg(val: boolean) {
  delRowDialogVisiable.value = val;
}
// 议程详情
function toggleAgendaDlg(val: boolean, listIndex?: number) {
  if (listIndex || listIndex === 0) {
    const targetData =
      scheduleData.value.content[tabType.value].content[
        otherTabType.value[tabType.value]
      ].content[listIndex];
    dialogTopicContnet.value = targetData.detail;
    dialogTopicTitle.value = targetData.desc;
    idShow.value = listIndex;
  }
  agendaDialogVisiable.value = val;
}
// 确认保持议程详情
function confirmSaveAgenda() {
  scheduleData.value.content[tabType.value].content[
    otherTabType.value[tabType.value]
  ].content[idShow.value].detail = dialogTopicContnet.value;
  toggleAgendaDlg(false);
}
function toggleDelTabDlg(val: boolean) {
  delTabDialogVisiable.value = val;
}
// function createNewPage() {
//   param.content = JSON.stringify(data);
//   createPage(param).then(() => {
//     ElMessage({
//       type: 'success',
//       message: '成功',
//     });
//   });
// }
const tabType1 = ref(0);
const agendaData2 = ref([]);
watch(
  tabType1,
  () => {
    if (tabType1.value === 1) {
      agendaData2.value = scheduleData.value.content.slice(1);
    } else {
      agendaData2.value = scheduleData.value.content.slice(0, 1);
    }
  },
  {
    immediate: true,
  }
);
onBeforeRouteLeave((to, from, next) => {
  if (!modeType.value) {
    savePageData();
    next();
  } else {
    next();
  }
});
onUnmounted(() => {
  clearInterval(timer);
  document.removeEventListener('click', function () {
    isInputFocus.value =
      document.querySelector('.edit-summit :focus-within') !== null;
  });
});
</script>

<template>
  <div class="schedule" :class="isEditStyle ? 'is-edit' : ''">
    <!-- <h4 class="meeting-title">
      <el-input
        v-model="scheduleData.title"
        :readonly="!isEditStyle"
        type="text"
        @blur="savePageData()"
      />
    </h4> -->
    <el-tabs
      v-if="scheduleName === 'schedule'"
      v-model.number="tabType1"
      class="schedule-tabs"
    >
      <el-tab-pane :name="0">
        <template #label>
          <div class="one-level-tabs">
            <!-- <el-input
              v-model="itemList.lable"
              :readonly="!isEditStyle"
              type="text"
              @blur="savePageData()"
            /> -->
            上午
            <!-- <span
              v-show="isEditStyle"
              class="icon-del del-title"
              @click.stop="delSubtitle(index)"
            ></span> -->
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane :name="1">
        <template #label>
          <div class="one-level-tabs">
            <!-- <el-input
              v-model="itemList.lable"
              :readonly="!isEditStyle"
              type="text"
              @blur="savePageData()"
            /> -->
            下午
            <!-- <span
              v-show="isEditStyle"
              class="icon-del del-title"
              @click.stop="delSubtitle(index)"
            ></span> -->
          </div>
        </template>
      </el-tab-pane>
      <!-- <el-tab-pane v-if="isEditStyle">
        <template #label>
          <OIcon
            class="icon-add"
            :class="scheduleData.content?.length >= 2 ? 'margin-left' : ''"
            @click.stop="addSubtitle"
          >
            <IconAdd />
          </OIcon>
        </template>
      </el-tab-pane> -->
    </el-tabs>
    <el-container
      v-for="(scheduleItem, index) in scheduleData.content"
      :key="scheduleItem.id"
      :level-index="1"
    >
      <template
        v-if="
          scheduleName === 'schedule'
            ? tabType1 === 0
              ? index === 0
              : index !== 0
            : true
        "
      >
        <div v-if="scheduleName === 'schedule'" class="schedule-title">
          <el-input
            v-model="scheduleItem.lable"
            :readonly="!isEditStyle"
            type="text"
          />
        </div>
        <div
          v-if="scheduleItem?.content"
          class="schedule-item other"
          @click.capture="tabType = index"
        >
          <el-tabs
            v-if="
              isEditStyle ||
              (scheduleItem.content.length && scheduleItem.content[0].name)
            "
            v-model.number="otherTabType[index]"
            class="other-tabs"
            :class="scheduleItem.content.length === 1 ? 'no-bar' : ''"
            @keydown.capture.stop
          >
            <template v-if="scheduleItem.content.length">
              <el-tab-pane
                v-for="(itemList, scheduleIndex) in scheduleItem.content"
                :key="itemList.id"
                :name="scheduleIndex"
              >
                <template #label>
                  <div v-show="isEditStyle" class="time-tabs">
                    <el-input
                      v-model="itemList.name"
                      :placeholder="isEditStyle ? '输入论坛名称' : ''"
                      :class="itemList.name ? '' : 'empty'"
                      :readonly="!isEditStyle"
                      type="text"
                    />

                    <span
                      v-show="isEditStyle"
                      class="icon-del del-title"
                      @click.stop="delSubtitle2(scheduleIndex)"
                      ><span class="tip">删除此论坛</span></span
                    >
                  </div>
                  <span v-show="!isEditStyle" class="previve-tab">{{
                    itemList.name
                  }}</span>
                </template>
              </el-tab-pane>
            </template>

            <el-tab-pane v-if="isEditStyle">
              <template #label>
                <OIcon
                  class="icon-add"
                  :class="scheduleItem.content.length ? 'margin-left' : ''"
                  @click.capture.stop="addSubtitle2"
                >
                  <IconAdd />
                  <span class="tip">新增分论坛标题</span>
                </OIcon>
              </template>
            </el-tab-pane>
          </el-tabs>
          <div
            v-for="(itemList, listIndex) in scheduleItem.content"
            :key="itemList.id"
            class="content"
          >
            <template v-if="otherTabType[index] === listIndex">
              <!-- <h4 v-if="itemList.title || isEditStyle" class="other-title">
              <el-input
                v-model="itemList.title"
                :readonly="!isEditStyle"
                type="text"
              />
            </h4> -->
              <div class="content-list">
                <draggable
                  :list="itemList?.content"
                  item-key="id"
                  chosen-class="chosen-class"
                  animation="300"
                  :disabled="!isEditStyle || isInputFocus"
                >
                  <template #item="{ element, index }">
                    <div
                      class="content-item"
                      :class="[
                        {
                          'show-detail':
                            indexShow === index && idShow === listIndex,
                        },
                        isEditStyle ? 'move' : '',
                      ]"
                    >
                      <span class="time">
                        <IconTime />
                        <el-input
                          v-model="element.time"
                          class="el-input-time"
                          :placeholder="isEditStyle ? '输入时间' : ''"
                          :readonly="!isEditStyle"
                          type="text"
                        />
                      </span>
                      <span
                        class="desc"
                        :class="{ 'exit-detail': element.detail[0] }"
                        @click="
                          !isEditStyle
                            ? changeIndexShow(listIndex, index as any)
                            : ''
                        "
                      >
                        <el-input
                          v-model="element.desc"
                          :readonly="!isEditStyle"
                          :autosize="{ minRows: 1, maxRows: 15 }"
                          maxlength="100"
                          :placeholder="isEditStyle ? '输入议程标题' : ''"
                          type="textarea"
                        />
                        <OIcon
                          v-show="isEditStyle"
                          class="icon-add"
                          @click="toggleAgendaDlg(true, index)"
                        >
                          <IconLinkDefault v-if="!element.detail" />
                          <IconLinkFilled v-else />
                          <div class="tip">附加议程简介</div>
                        </OIcon>
                      </span>
                      <div v-if="element.person[0]" class="name-box">
                        <div
                          v-for="(personItem, personIndex) in element.person"
                          :key="personItem.id"
                          class="name-item"
                        >
                          <span v-show="personItem.name" class="name">
                            <el-input
                              v-model="personItem.name"
                              :readonly="!isEditStyle"
                              :placeholder="isEditStyle ? '嘉宾名称' : ''"
                              type="text"
                            />
                          </span>
                          <span class="post">
                            <label :for="`textarea${personIndex}`"></label>
                            <el-input
                              :id="`textarea${personIndex}`"
                              v-model="personItem.post"
                              :class="!personItem.post ? 'empty' : ''"
                              :readonly="!isEditStyle"
                              :autosize="{ minRows: 1, maxRows: 10 }"
                              maxlength="100"
                              type="textarea"
                              :placeholder="
                                isEditStyle
                                  ? '嘉宾头衔（只有一列信息请填这里）'
                                  : ''
                              "
                            />
                          </span>
                          <span
                            v-show="isEditStyle"
                            class="icon-del"
                            @click="delPersonData(index, personIndex)"
                            ><span class="tip">删除附属信息</span></span
                          >
                        </div>
                        <OIcon
                          v-show="isEditStyle"
                          class="icon-add"
                          @click="addPersonData(index)"
                        >
                          <span class="tip">新增附属信息</span>
                          <IconAdd />
                        </OIcon>
                      </div>
                      <div v-if="element.detail" class="detail">
                        <p>
                          <span>议题名称：</span
                          ><span> {{ element.desc }}</span>
                        </p>
                        <p v-if="element.detail">
                          <span>议题简介：</span
                          ><span
                            ><span class="detail-text">
                              {{ element.detail }}
                            </span></span
                          >
                        </p>
                      </div>
                      <div
                        v-show="
                          indexShow !== -1 &&
                          element.detail &&
                          idShow === listIndex
                        "
                        class="mask"
                        @click="changeIndexShow(-1, -1)"
                      ></div>
                      <span
                        v-if="isEditStyle"
                        class="icon-del del-content"
                        @click="delContent(index)"
                        ><span class="tip">删除此行</span></span
                      >
                    </div>
                  </template>
                </draggable>
              </div>
              <OIcon
                v-if="isEditStyle"
                class="icon-add add-content"
                @click="addContent"
              >
                <IconAdd />
                <span class="tip">新增一行内容</span>
              </OIcon>
            </template>
          </div>
        </div>
      </template>
    </el-container>
  </div>
  <el-dialog
    v-model="agendaDialogVisiable"
    class="agenda-dialog"
    :show-close="false"
    width="640"
  >
    <template #header>
      <h3>编辑议题简介</h3>
      <div class="detail-tip">注：Hover/点击议题名称时展开</div>
    </template>
    <div class="line-input">
      <span class="label">议题名称</span>
      <el-input v-model="dialogTopicTitle" readonly></el-input>
    </div>
    <div class="line-input">
      <span class="label">议题简介</span>
      <el-input
        v-model="dialogTopicContnet"
        type="textarea"
        maxlength="500"
        show-word-limit
        :autosize="{ minRows: 12, maxRows: 20 }"
      ></el-input>
    </div>
    <template #footer>
      <o-button size="small" @click="toggleAgendaDlg(false)">取消</o-button>
      <o-button size="small" type="primary" @click="confirmSaveAgenda()">
        确定</o-button
      >
    </template>
  </el-dialog>
  <el-dialog
    v-model="delRowDialogVisiable"
    class="publish-dialog"
    :show-close="false"
    width="640"
  >
    <template #header>
      <OIcon class="danger1">
        <IconWarn />
      </OIcon>
    </template>
    <h3>
      是否确认
      <span class="danger1">删除</span>
      本行
    </h3>
    <template #footer>
      <o-button size="small" @click="toggleDelDlg(false)">取消</o-button>
      <o-button size="small" type="primary" @click="confirmDelContent()">
        确定</o-button
      >
    </template>
  </el-dialog>
  <el-dialog
    v-model="delTabDialogVisiable"
    class="publish-dialog"
    :show-close="false"
    width="640"
  >
    <template #header>
      <OIcon class="danger1">
        <IconWarn />
      </OIcon>
    </template>
    <h3>
      是否确认
      <span class="danger1">删除</span>
      本分论坛所有日程
    </h3>
    <template #footer>
      <o-button size="small" @click="toggleDelTabDlg(false)">取消</o-button>
      <o-button size="small" type="primary" @click="confirmDelTab()">
        确定</o-button
      >
    </template>
  </el-dialog>
  <!-- <div v-show="isEditStyle" class="contoral-box">
    <o-button size="small" type="primary" @click="savePageData">保存</o-button>
    <o-button @click="createNewPage">保存</o-button>
  </div> -->
</template>

<style lang="scss" scoped>
.danger1 {
  color: #e02020;
}

.chosen-class {
  box-shadow: var(--o-shadow-l2_hover);
}
.move {
  cursor: move;
}
:deep(.el-input) {
  .el-input__wrapper {
    border: 1px solid transparent;
    &:not(.is-focus) {
      box-shadow: none;
    }
    box-shadow: none;
    input {
      &[readonly] {
        cursor: text;
        padding: 0;
        box-shadow: none;
        border: 1px solid transparent;
        &:focus-visible {
          border: 1px solid transparent;
          box-shadow: none;
          outline: none;
        }
      }
    }
  }
}

.el-date-editor.el-input__wrapper {
  background-color: transparent;
}
:deep(.el-tabs__nav-wrap) {
  overflow: visible;
  .el-tabs__nav-scroll {
    overflow: visible;
  }
}

.schedule {
  h3 {
    position: relative;
    text-align: center;
    font-size: var(--o-font-size-h3);
    line-height: var(--o-line-height-h3);
    color: var(--o-color-text1);
    font-weight: 300;
  }
  .meeting-title {
    margin-top: 40px;
    font-weight: 400;
    color: var(--o-color-text1);
    font-size: 20px;
    line-height: 28px;
    text-align: center;
    @media screen and (max-width: 768px) {
      font-size: 14px;
      line-height: 22px;
    }
    :deep(.el-input__inner) {
      font-size: var(--o-font-size-h6);
      text-align: center;
    }
  }
  .el-container {
    display: flex;
    flex-direction: column;
    .schedule-item {
      box-shadow: var(--o-shadow-1);
    }
    .schedule-title {
      margin-top: 32px;
      :deep(.el-input) {
        .el-input__inner {
          font-size: 20px;
          text-align: center;
        }
      }
    }
  }
  :deep(.el-tabs) {
    .el-tabs__header.is-top .el-tabs__item.is-top {
      padding: 0;
    }
  }
  .schedule-tabs {
    position: relative;
    text-align: center;
    margin-top: 32px;
    :deep(.el-tabs__header.is-top) {
      margin: 0;
    }
    :deep(.el-tabs__content) {
      margin-top: 0;
      overflow: visible;
      .el-button {
        position: absolute;
        left: 0;
        top: -75px;
        z-index: 1;
      }
    }
    :deep(.el-tabs__nav-prev),
    :deep(.el-tabs__nav-next) {
      display: none;
    }
    :deep(.el-tabs__nav) {
      float: none;
      display: inline-block;
      .el-tabs__active-bar {
        display: none;
      }
      .el-tabs__item {
        padding: 0;
      }
    }
    .time-tabs {
      display: inline-block;
      margin: 0 0 24px;
      cursor: pointer;
      color: var(--o-color-text1);
      text-align: center;
      background: var(--o-color-bg2);
      font-size: 14px;
      line-height: 38px;
      padding: 0 16px;
      @media (max-width: 1100px) {
        line-height: 28px;
        font-size: 12px;
        padding: 0 12px;
      }
    }

    .one-level-tabs {
      position: relative;
      width: 160px;
      height: 40px;
      background: var(--o-color-bg2);
      border-color: var(--o-color-primary2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--o-font-size-text);
      border: 1px solid var(--o-color-border2);
      // :deep(.el-input) {
      //   cursor: pointer;
      //   .el-input__inner {
      //     cursor: pointer;
      //     width: min-content;
      //     color: var(--o-color-text1);
      //     text-align: center;
      //   }
      // }
      // .del-title {
      //   left: inherit;
      //   width: 16px;
      //   height: 16px;
      //   right: -8px;
      //   top: -14px;
      //   transform: none;
      //   &::after {
      //     height: 2px;
      //     width: calc(100% - 6px);
      //   }
      // }
    }
    .is-active {
      .one-level-tabs {
        color: var(--o-color-text2);
        background: var(--o-color-primary1);
        border: none;
        :deep(.el-input) {
          .el-input__inner {
            width: min-content;
            color: var(--o-color-text2);
            text-align: center;
          }
        }
      }
    }
  }
  .schedule-item {
    margin-top: 32px;
    width: 100%;
    padding: 24px;
    background-color: var(--o-color-bg2);
    @media (max-width: 1100px) {
      padding: 16px;
    }
    &.other {
      .del-title {
        left: inherit;
        right: -8px;
        width: 16px;
        height: 16px;
        top: -14px;
        &::after {
          height: 2px;
          width: calc(100% - 6px);
        }
      }
      :deep(.el-tabs) {
        margin-bottom: 24px;
        .el-tabs__header.is-top .el-tabs__item.is-top {
          // padding: 10px 20px 10px 0;
          @media (max-width: 1100px) {
            height: auto;
            padding: 6px 18px 6px 0;
            line-height: 22px;
          }
        }
        .el-tabs__nav {
          float: none;
          display: inline-block;
          @media (max-width: 1100px) {
            line-height: 44px;
          }
        }
        .el-tabs__header {
          text-align: center;
          margin: 0;
          .el-tabs__nav-wrap {
            overflow: visible;
            .el-tabs__nav-scroll {
              overflow: visible;
            }
          }
          .el-tabs__item:not(:last-child) {
            margin-right: 20px;

            @media (max-width: 1100px) {
              font-size: 12px;
              line-height: 18px;
            }
          }
          .el-tabs__item {
            // &:not(:hover) .empty {
            //   visibility: hidden;
            // }

            .el-input__wrapper {
              padding: 0 4px;
            }
            .el-input__inner {
              text-align: center;
            }
            .previve-tab {
              font-size: var(--o-font-size-h7);
            }
          }
        }
      }
      :deep(.no-bar) {
        .el-tabs__active-bar {
          display: none;
        }
        .previve-tab {
          color: var(--o-color-text1);
        }
      }
      :deep(.el-tabs__nav-scroll) {
        text-align: center;
      }
      :deep(.el-tabs__content) {
        overflow: visible;
        @media (max-width: 1100px) {
          margin-top: 16px;
        }
      }
      :deep(.el-tabs__nav) {
        float: none;
        display: inline-block;
        @media (max-width: 1100px) {
          line-height: 44px;
        }
      }
      .other-text {
        margin: 24px auto 0 auto;
        color: var(--o-color-text1);
        font-size: 18px;
        line-height: 26px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        @media (max-width: 1100px) {
          font-size: 14px;
          line-height: 22px;
          margin: 16px 0;
        }
        svg {
          margin-right: 8px;
        }
      }
      .other-title {
        margin: 24px auto;
        color: var(--o-color-text1);
        font-size: 18px;
        line-height: 26px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: normal;
        @media (max-width: 1100px) {
          font-size: 14px;
          line-height: 22px;
          margin: 16px 0;
        }
      }
      :deep(.content-list) {
        .detail {
          display: none;
        }
        .show-detail {
          .detail {
            display: block;
          }
        }
      }
      .exit-detail {
        cursor: pointer;
      }
    }
    :deep(.detail) {
      display: none;
    }
  }
  .add-content {
    margin-top: 16px;
    width: 40px;
    height: 40px;
    font-size: 24px;
  }
}
.is-edit {
  :deep(.el-input__wrapper) {
    &:hover {
      border: 1px solid var(--o-color-brand1);
      box-shadow: 0px 4px 16px 0px rgba(45, 47, 51, 0.32);
    }
  }
  :deep(.el-input) {
    .is-focus {
      border: 1px solid transparent;
      box-shadow: 0 0 0 1px var(--o-color-brand1) inset;
    }
  }
  :deep(.el-tabs) {
    .el-tabs__item {
      max-width: 150px;
      margin: 0 !important;
    }
  }

  .name-item {
    position: relative;
    border: 1px solid transparent;
    transition: all 0.3s;
    min-height: 51px;
    :deep(.el-input) {
      .el-input__inner {
        color: #707070;
      }
    }
    &:not(:focus-within):not(:hover) .empty {
      display: none;
    }
    .empty {
      :deep(textarea) {
        max-height: 64px !important;
        font-size: 14px;
      }
    }

    &:hover {
      border: 1px solid var(--o-color-brand1);
      box-shadow: 0px 4px 16px 0px rgba(45, 47, 51, 0.32);
      .name {
        display: inline-block !important;
      }
    }
    &:focus-within {
      border: 1px solid var(--o-color-brand1);
      box-shadow: none;
      .name {
        display: inline-block !important;
      }
      .post {
        border-left: 1px solid var(--o-color-brand1);
      }
    }
  }
  .desc {
    :deep(.el-textarea) {
      textarea {
        resize: none;
        min-height: 38px !important;
        padding: 8px 14px !important;
        cursor: text;
        padding: 0;
        box-shadow: none;
        border: 1px solid transparent;
        resize: none;
        &:hover:not(:focus-visible) {
          border: 1px solid var(--o-color-brand1);
          box-shadow: 0px 4px 16px 0px rgba(45, 47, 51, 0.32);
        }
        &:focus-visible {
          border: 1px solid var(--o-color-brand1) !important;
          outline: none;
        }
      }
    }
  }
}
.icon-del {
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -36px;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  background-color: var(--o-color-bg2);
  border: 1px solid #e02020;

  box-shadow: 0px 4px 16px 0px rgba(45, 47, 51, 0.32);
  &:hover {
    .tip {
      display: block;
    }
  }
  .tip {
    line-height: var(--o-font-size-tip);
    display: none;
    position: absolute;
    transform: translate(100%, -50%);
    color: #555;
    width: max-content;
    right: -8px;
    top: 50%;
    font-size: var(--o-font-size-tip);
    padding: 4px 8px;
    background-color: var(--o-color-bg2);
    box-shadow: var(--o-shadow-1);
  }
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    border-radius: 2px;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 3px;
    width: calc(100% - 10px);
    background-color: #e02020;
  }
}
.icon-add {
  position: relative;
  margin: 0 auto;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--o-font-size-text);
  border-radius: 50%;
  border: 1px solid var(--o-color-brand1);
  color: var(--o-color-brand1);
  box-shadow: 0px 4px 16px 0px rgba(45, 47, 51, 0.32);
  &:hover {
    .tip {
      display: block;
    }
  }
  .tip {
    display: none;
    position: absolute;
    transform: translate(100%, -50%);
    color: #555;
    width: max-content;
    right: -8px;
    top: 50%;
    font-size: var(--o-font-size-tip);
    padding: 4px 8px;
    background-color: var(--o-color-bg2);
    box-shadow: var(--o-shadow-1);
  }
}
.margin-left {
  margin-left: 40px;
}
.margin-top {
  margin-top: 40px;
}
.contoral-box {
  margin-top: 24px;
}
.content-list {
  @media screen and (max-width: 1100px) {
    position: relative;
  }
  .content-item {
    display: grid;
    min-height: 92px;
    grid-template-columns: 192px 580px 400px;
    padding: 20px 0;
    transition: all 0.25s ease;
    align-items: center;
    // min-height: 64px;
    position: relative;
    &:hover {
      .name-box {
        .icon-add,
        .icon-del {
          display: block;
        }
      }
    }
    & + .content-item {
      border-top: 1px solid var(--o-color-border2);
    }

    @media screen and (max-width: 1328px) {
      grid-template-columns: 192px 450px 400px;
    }
    @media screen and (max-width: 1100px) {
      grid-template-columns: 80px auto;
      padding: 6px 0;
      min-height: 36px;
      position: static;
    }
    .name-box {
      position: relative;

      .icon-add,
      .icon-del {
        display: none;
        position: relative;
        width: 16px;
        height: 16px;
        right: -8px;
        background-color: var(--o-color-bg2);
        &:hover {
          .tip {
            display: block;
          }
        }
        .tip {
          display: none;
          position: absolute;
          transform: translate(100%, -50%);
          color: #555;
          width: max-content;
          right: -8px;
          top: 50%;
          font-size: var(--o-font-size-tip);
          padding: 4px 8px;
          background-color: var(--o-color-bg2);
          box-shadow: var(--o-shadow-1);
        }
      }
      .icon-add {
        position: absolute;
        bottom: -8px;
      }
      .icon-del {
        position: absolute;
        top: 0;
        left: inherit;
        background-color: var(--o-color-bg2);
        &::after {
          height: 2px;
          border-radius: 1px;
          width: calc(100% - 6px);
        }
      }
      @media screen and (max-width: 1100px) {
        grid-column-end: 3;
      }
      div {
        display: flex;
        align-items: center;
        @media screen and (max-width: 1100px) {
          grid-column-start: 2;
          grid-column-end: 3;
          display: block;
        }
      }
    }
    .del-content {
      cursor: pointer;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: -36px;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      border: 1px solid #e02020;
      &::after {
        content: '';
        position: absolute;
        left: 50%;
        border-radius: 1px;
        top: 50%;
        transform: translate(-50%, -50%);
        height: 3px;
        width: calc(100% - 10px);
        background-color: #e02020;
      }
    }
    .desc {
      position: relative;
      font-size: 18px;
      line-height: 26px;
      color: var(--o-color-text1);
      display: inline-block;
      margin-right: 36px;
      cursor: default;
      &:hover {
        .o-icon {
          display: flex;
        }
      }
      &:focus-within {
        .o-icon {
          display: block;
        }
      }
      :deep(.el-textarea) {
        textarea {
          resize: none;
          min-height: 45px !important;
          padding: 8px 14px !important;
          cursor: text;
          padding: 0;
          font-size: var(--o-font-size-h7);
          box-shadow: none;
          border: 1px solid transparent;
          resize: none;
          // &:hover:not(:focus-visible) {
          //   border: 1px solid var(--o-color-brand1);
          //   box-shadow: 0px 4px 16px 0px rgba(45, 47, 51, 0.32);
          // }
          // &:focus-visible {
          //   border: 1px solid var(--o-color-brand1);
          //   outline: none;
          // }
        }
      }
      .o-icon {
        position: absolute;
        right: -8px;
        top: -8px;
        width: 18px;
        height: 18px;
        font-size: 18px;
        background-color: var(--o-color-bg2);
        border: none;
        display: none;
      }
      @media (max-width: 1100px) {
        margin-right: 0;
        font-size: 12px;
        line-height: 18px;
      }
    }

    .name {
      width: 120px;
      height: 100%;
      display: inline-block;
      color: var(--o-color-text3);
      font-size: 16px;
      line-height: 24px;
      :deep(.el-input__wrapper) {
        box-shadow: none;
        border: 1px solid transparent;
        .el-input__inner {
          &::-webkit-input-placeholder {
            font-size: 14px;
          }
          font-size: var(--o-font-size-h7);
          color: var(--o-color-text3);
        }
      }
      @media (max-width: 1100px) {
        font-size: 12px;
        line-height: 18px;
      }
    }
    .post {
      width: 100%;
      display: inline-block;
      color: var(--o-color-text3);
      font-size: 16px;
      line-height: 24px;
      flex: 1;
      border-left: 1px solid transparent;
      transition: all 0.3s;

      :deep(.el-textarea) {
        textarea {
          &::-webkit-input-placeholder {
            font-size: 14px;
            line-height: var(--o-line-height-h7);
          }
          resize: none;
          min-height: 45px !important;
          padding: 10px 14px !important;
          cursor: text;
          padding: 0;
          font-size: var(--o-font-size-h7);
          color: var(--o-color-text3);
          box-shadow: none;
          border: 1px solid transparent;
          resize: none;
          &:focus-visible {
            border: 1px solid transparent;
            box-shadow: none;
            outline: none;
          }
        }
      }
      @media (max-width: 1100px) {
        font-size: 12px;
        line-height: 18px;
      }
    }
    .post-more {
      width: 345px;
      @media screen and (max-width: 1100px) {
        width: 100%;
      }
    }
    .time {
      width: 192px;
      font-size: 18px;
      line-height: 26px;
      color: var(--o-color-text3);
      display: flex;
      align-items: center;
      @media screen and (max-width: 1100px) {
        font-size: 12px;
        line-height: 18px;
        width: 80px;
      }
      svg {
        width: 18px;
        height: 18px;
        color: var(--o-color-text3);
        margin-right: 6px;
        @media screen and (max-width: 1100px) {
          display: none;
        }
      }
      .el-input-time {
        width: 100px;
        text-align: center;
        :deep(.el-input__wrapper) {
          padding: 0;
          .el-input__inner {
            font-size: var(--o-font-size-h8);
            color: var(--o-color-text3);
          }
        }
      }
    }
    .info .desc {
      width: 460px;
      margin-right: 40px;
      display: inline-block;
    }
    .detail {
      width: 75%;
      padding: 40px;
      position: absolute;
      top: 60px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9;
      background-color: var(--o-color-bg2);
      box-shadow: var(--o-shadow-l4);
      max-height: 300px;
      overflow: auto;
      @media (max-width: 1100px) {
        padding: 24px;
        top: 50% !important;
        transform: translateX(-50%) translateY(-50%);
      }
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
      // display: none;
      p {
        display: flex;
        & + p {
          margin-top: 8px;
        }
        > span {
          font-size: 14px;
          line-height: 22px;
          color: var(--o-color-text1);
          display: inline-block;
          @media (max-width: 1100px) {
            font-size: 12px;
            line-height: 18px;
          }
          &:nth-of-type(1) {
            display: inline-block;
            width: 110px;
            @media (max-width: 1100px) {
              width: 80px;
            }
          }
          &:nth-of-type(2) {
            flex: 1;
          }
          .detail-text {
            display: block;
          }
        }
      }
    }
    &:nth-last-of-type(1),
    &:nth-last-of-type(2),
    &:nth-last-of-type(3) {
      .detail {
        top: auto;
        bottom: 68px;
        @media (max-width: 1100px) {
          top: auto;
          bottom: 72px;
        }
      }
    }
    &:nth-last-of-type(4) {
      .detail {
        top: 80px;
      }
    }
  }
  .mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
  .sub-container {
    .content-item {
      grid-template-columns: 192px auto 96px 410px;
    }
  }
}
</style>
<style lang="scss">
.agenda-dialog {
  h3 {
    font-size: 24px;
    font-weight: 400;
    color: var(--o-color-text1);
    line-height: 32px;
    text-align: center;
  }
  .detail-tip {
    text-align: center;
    margin-top: 8px;
    color: #999999;
  }
  .line-input {
    display: flex;
    align-items: center;
    .el-input {
      .el-input__wrapper {
        box-shadow: 0 0 0 1px #cccccc inset;
        .el-input__inner {
          color: #999999;
          cursor: not-allowed;
        }
      }
    }
    &:not(:first-child) {
      margin-top: 16px;
    }

    .label {
      font-size: var(--o-font-size-text);
      color: var(--o-color-text4);
      flex-shrink: 0;
      width: fit-content;
      margin-right: 40px;
    }
  }
  .el-dialog__footer {
    display: flex;
    justify-content: center;
    .o-button:first-child {
      margin-right: 16px;
    }
  }
}
</style>
