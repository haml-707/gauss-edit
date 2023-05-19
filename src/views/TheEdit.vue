<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { useRouter } from 'vue-router';

import { OButton } from '@/components/button';
import OIcon from '@/components/OIcon.vue';

import IconSearch from '~icons/app/icon-search.svg';
import IconArrowRight from '~icons/app/icon-arrow-right.svg';
import { profileData } from '@/api/api-easy-edit';
import { getUrlParams } from '@/shared/utils';
import { useVersionData } from '@/stores';

interface EditData {
  siteName: string;
  type: string;
  locale: string;
  path: string;
  updated_at: string;
}

const router = useRouter();

const editData = ref<EditData[]>([]);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);
const totalPage = ref(0);
const layout = ref('sizes, prev, pager, next, slot, jumper');

const queryData = reactive({
  page: 1,
  per_page: 10,
});
const pageNameList = ref<string[]>([]);
const pageTypeList = ref<string[]>([]);
pageNameList.value = [];
pageTypeList.value = [];

// 前端筛选 获取所有siteName, type
function filterOption() {
  editData.value.forEach((item) => {
    if (!pageNameList.value?.includes(item.siteName)) {
      pageNameList.value.push(item.siteName);
    }
    if (!pageTypeList.value?.includes(item.type)) {
      pageTypeList.value.push(item.type);
    }
  });
}

const optionQuery = reactive({
  siteName: '',
  type: '',
});

const randerData = computed(() => {
  return editData.value.slice(
    pageSize.value * (currentPage.value - 1),
    pageSize.value * currentPage.value
  );
});

const goEdit = (item: EditData) => {
  let path = '';
  if (item.type === 'sig') {
    path = `/${item.locale}/edit/${item.type}/${getUrlParams(item.path)?.name}`;
  } else {
    path = `/${item.locale}/edit/${item.type}/${item.path.split('/').at(-2)}/`;
  }
  useVersionData().setCoverData(true);
  router.push(path);
};

// 分页size修改
const handleSizeChange = (val: number) => {
  queryData.per_page = val;
  totalPage.value = Math.ceil(total.value / val);
};

const handleCurrentChange = (val: number) => {
  queryData.page = val;
  currentPage.value = val;
};

function getPageData(isFirstGet: boolean) {
  profileData(optionQuery).then((res) => {
    if (res?.statusCode === 200) {
      // 只展示 gauss 数据
      editData.value = res.data.filter((item: EditData) => {
        return item.path.includes('opengauss');
      });
      if (isFirstGet) {
        pageNameList.value = [];
        pageTypeList.value = [];
        filterOption();
      }
    } else {
      editData.value = [];
    }
  });
}
getPageData(true);
watch(
  () => optionQuery,
  () => {
    getPageData(false);
    currentPage.value = 1;
  },
  {
    deep: true,
  }
);
</script>

<template>
  <div class="edit-table">
    <h2 class="edit-table-title">可自编辑页面</h2>
    <div class="select-box">
      <div class="select-item">
        <div class="select-label">页面名称</div>
        <el-select v-model="optionQuery.siteName" filterable clearable>
          <template #prefix>
            <OIcon>
              <IconSearch />
            </OIcon>
          </template>
          <el-option
            v-for="item in pageNameList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
      <div class="select-item">
        <div class="select-label">页面类别</div>
        <el-select v-model="optionQuery.type" filterable clearable>
          <template #prefix>
            <OIcon>
              <IconSearch />
            </OIcon>
          </template>
          <el-option
            v-for="item in pageTypeList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
    </div>
    <div class="input-container"></div>
    <el-table :data="randerData">
      <el-table-column label="页面名称" prop="siteName" min-width="150">
      </el-table-column>
      <el-table-column label="页面类别" prop="type" min-width="80">
      </el-table-column>
      <el-table-column label="页面语言" prop="locale" min-width="80">
      </el-table-column>
      <el-table-column label="目标页面链接" prop="path" min-width="310">
        <template #default="scope">
          <a :href="scope.row.path" target="_blank"> {{ scope.row.path }} </a>
        </template>
      </el-table-column>
      <el-table-column label="最新修改时间" prop="updated_at" min-width="110">
      </el-table-column>
      <el-table-column min-width="110" prop="path">
        <template #default="scope">
          <OButton
            class="start-edit"
            animation
            type="text"
            @click="goEdit(scope.row)"
            >开始编辑
            <template #suffixIcon>
              <OIcon>
                <IconArrowRight></IconArrowRight>
              </OIcon>
            </template>
          </OButton>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      class="pagination"
      :page-sizes="[5, 10, 20, 40, 80]"
      :layout="layout"
      :total="editData.length"
      :background="true"
      :hide-on-single-page="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <span class="slot-content">{{ currentPage }}/{{ totalPage }}</span>
    </el-pagination>
  </div>
</template>

<style lang="scss" scoped>
.edit-table {
  padding: 64px 40px;
  background-color: var(--o-color-bg1);
  margin-bottom: 64px;
  .edit-table-title {
    font-weight: 300;
    text-align: center;
    font-size: var(--o-font-size-h3);
  }
  .select-box {
    display: flex;
    align-items: flex-start;
    align-items: center;
    gap: 0 64px;
    margin-top: 40px;
    .select-item {
      display: flex;
      align-items: center;
      .select-label {
        margin-right: 24px;
      }
      :deep(.el-select) {
        .el-input__wrapper:not(.is-focus) {
          box-shadow: var(--o-shadow-l1);
        }
        .el-input__prefix-inner {
          color: var(--o-color-neutral8);
        }
      }
    }
  }
  .el-table {
    margin-top: 24px;
    .o-button {
      .o-icon {
        font-size: var(--o-font_size-h4);
        color: var(--o-color-primary1);
      }
    }
  }
  .pagination {
    margin-top: 24px;
  }
}
</style>
