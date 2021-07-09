<template>
  <div class="problem-history-compoment" v-if="form?.length > 0">
    <h4>跟踪记录</h4>
    <div v-for="item in form">
      <el-form :model="form" label-width="160px" label-suffix="：">
        <!-- 问题系统补充 和 专家系统补充 ---- 公用 展示 -->
        <div
          v-if="item.operationType == 1 || item.operationType == 4  || item.operationType == 9"
          class="history-item-box"
          :class="{ cursorPointer: !item.showDetail }"
          @click="showRecordDetail(item)"
        >
          <!-- 收起 -->
          <p v-if="!item.showDetail" class="border">
            {{ item.createdTime }} 由
            <span class="weight">{{ item.creator }}</span>
            {{ typeName[item.operationType] }}
          </p>
          <!-- 展开 -->
          <div class="border" v-else>
            <div class="record-title">
              <h5 class="cursorPointer" @click.stop="closeRecordDetail(item)">
                {{ item.createdTime }}
                <span>{{ item.creator }}</span>
                {{ typeName[item.operationType] }}
              </h5>
            </div>
            <div class="common-one-box">
              <el-form-item label="补充信息">
                <span>{{ item.supplementDescription }}</span>
              </el-form-item>
            </div>
            <div class="common-one-box" v-if="item.accessoryList?.length > 0 && item.operationType != 9">
              <el-form-item label="问题附件">
                <a
                  class="display-block"
                  v-for="item in item.accessoryList"
                  :key="item"
                  :download="item.name"
                  :href="item.url"
                >
                  {{ item.name }}
                </a>
              </el-form-item>
            </div>
          </div>
        </div>

        <!--问题系统 组长审核---展示 -->
        <div
          v-if="item.operationType == 2"
          class="history-item-box"
          :class="{ cursorPointer: !item.showDetail }"
          @click="showRecordDetail(item)"
        >
          <p v-if="!item.showDetail" class="border">
            {{ item.createdTime }} 由
            <span class="weight">{{ item.creator }}</span>
            {{ typeName[item.operationType] }}
          </p>
          <div class="border" v-else>
            <div class="record-title">
              <h5 class="cursorPointer" @click.stop="closeRecordDetail(item)">
                {{ item.createdTime }}
                <span>{{ item.creator }}</span>
                {{ typeName[item.operationType] }}
              </h5>
            </div>
            <!-- 组长: 内部解决 和 上报分析 共用--- 展示 -->
            <div v-if="item.auditType == 2 || item.auditType == 3">
              <div class="common-one-box">
                <el-form-item label="问题定位">
                  <span>{{ item.problemParts }}</span>
                </el-form-item>
              </div>
              <div class="common-two-box">
                <el-form-item label="问题分类">
                  <span>{{ item.problemAttributesNames }}</span>
                </el-form-item>
                <el-form-item label="问题等级">
                  <span>{{ problemLevelName[item.problemLevel] }}</span>
                </el-form-item>
              </div>
              <!-- 内部解决独有的 -->
              <div v-if="item.auditType == 2">
                <div class="common-two-box">
                  <el-form-item label="解决人/单位">
                    <span>{{ item.solver }}</span>
                  </el-form-item>
                  <el-form-item label="解决时间">
                    <span>{{ item.solvedTime }}</span>
                  </el-form-item>
                </div>
                <div class="common-one-box">
                  <el-form-item label="解决方案描述">
                    <span>{{ item.solution }}</span>
                  </el-form-item>
                </div>
                <div
                  class="common-one-box"
                  v-if="item.accessoryList?.length > 0"
                >
                  <el-form-item label="附件">
                    <a
                      class="display-block"
                      v-for="item in item.accessoryList"
                      :key="item"
                      :download="item.name"
                      :href="item.url"
                    >
                      {{ item.name }}
                    </a>
                  </el-form-item>
                </div>
                <div class="common-two-box">
                  <el-form-item label="校验人/单位">
                    <span>{{ item.verifier }}</span>
                  </el-form-item>
                  <el-form-item label="校验时间">
                    <span>{{ item.verificationTime }}</span>
                  </el-form-item>
                </div>
                <div class="common-one-box">
                  <el-form-item label="校验方案描述">
                    <span>{{ item.verificationResult }}</span>
                  </el-form-item>
                </div>
                <div
                  class="common-one-box"
                  v-if="item.checkAccessoryList?.length > 0"
                >
                  <el-form-item label="附件">
                    <a
                      class="display-block"
                      v-for="item in item.checkAccessoryList"
                      :key="item"
                      :download="item.name"
                      :href="item.url"
                    >
                      {{ item.name }}
                    </a>
                  </el-form-item>
                </div>
              </div>
              <div class="common-one-box">
                <el-form-item label="上报分析">
                  <span>{{ item.reportGroupName }}</span>
                </el-form-item>
              </div>
            </div>
            <!-- 组长: 不是问题, 关闭 和 上报分析 共用--- 展示 -->
            <div v-if="item.auditType == 1 || item.auditType == 3">
              <div class="common-one-box">
                <el-form-item label="补充描述">
                  <span>{{ item.supplementDescription }}</span>
                </el-form-item>
              </div>
              <div class="common-one-box">
                <el-form-item
                  label="问题附件"
                  v-if="item.accessoryList?.length > 0"
                >
                  <a
                    class="display-block"
                    v-for="item in item.accessoryList"
                    :key="item"
                    :download="item.name"
                    :href="item.url"
                  >
                    {{ item.name }}
                  </a>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>

        <!-- 问题系统校验 和 专家系统校验 ---- 公用 展示 区别是问题系统的校验 比 专家的多一个上报分析-->
        <div
          v-if="item.operationType == 3 || item.operationType == 6"
          class="history-item-box"
          :class="{ cursorPointer: !item.showDetail }"
          @click="showRecordDetail(item)"
        >
          <p v-if="!item.showDetail" class="border">
            {{ item.createdTime }} 由
            <span class="weight">{{ item.creator }}</span>
            {{ typeName[item.operationType] }}
          </p>
          <div class="border" v-else>
            <div class="record-title">
              <h5 class="cursorPointer" @click.stop="closeRecordDetail(item)">
                {{ item.createdTime }}
                <span>{{ item.creator }}</span>
                {{ typeName[item.operationType] }}
              </h5>
            </div>
            <div class="common-two-box">
              <el-form-item label="校验人/单位">
                <span>{{ item.verifier }}</span>
              </el-form-item>
              <el-form-item label="校验时间">
                <span>{{ item.verificationTime }}</span>
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="校验结果描述">
                <span>
                  {{ item.verificationType == 1 ? '未解决问题' : '解决问题' }}
                </span>
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="校验方案描述">
                <span>{{ item.verificationResult }}</span>
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="附件" v-if="item.checkAccessoryList?.length > 0">
                <a
                  class="display-block"
                  v-for="item in item.checkAccessoryList"
                  :key="item"
                  :download="item.name"
                  :href="item.url"
                >
                  {{ item.name }}
                </a>
              </el-form-item>
            </div>
            <div v-if="item.operationType == 3" class="common-one-box">
              <el-form-item label="上报分析">
                <span>{{ item.reportGroupName }}</span>
              </el-form-item>
            </div>
          </div>
        </div>

        <!-- 专家系统 专家分析---展示 -->
        <div
          v-if="item.operationType == 5"
          class="history-item-box"
          :class="{ cursorPointer: !item.showDetail }"
          @click="showRecordDetail(item)"
        >
          <p v-if="!item.showDetail" class="border">
            {{ item.createdTime }} 由
            <span class="weight">{{ item.creator }}</span>
            {{ typeName[item.operationType] }}
          </p>
          <div class="border" v-else>
            <!-- 专家分析共用 -->
            <div class="record-title">
              <h5 class="cursorPointer" @click.stop="closeRecordDetail(item)">
                {{ item.createdTime }}
                <span>{{ item.creator }}</span>
                {{ typeName[item.operationType] }}
              </h5>
            </div>
            <div class="common-one-box">
              <el-form-item label="问题定位">
                <span>{{ item.problemParts }}</span>
              </el-form-item>
            </div>
            <div class="common-two-box">
              <el-form-item label="问题分类">
                <span>{{ item.problemAttributesNames }}</span>
              </el-form-item>
              <el-form-item label="问题等级">
                <span>{{ problemLevelName[item.problemLevel] }}</span>
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="原因分析">
                <span>{{ item.causeAnalysis }}</span>
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="分析建议">
                <span>{{ item.managementProposal }}</span>
              </el-form-item>
            </div>
            <!-- 专家分析 -- 提供解决方案 展示 -->
            <div v-if="item.auditType == 2">
              <div class="common-one-box">
                <el-form-item label="解决方案描述">
                  <span>{{ item.solution }}</span>
                </el-form-item>
              </div>
              <div class="common-one-box">
                <el-form-item
                  label="附件"
                  v-if="item.accessoryList?.length > 0"
                >
                  <a
                    class="display-block"
                    v-for="item in item.accessoryList"
                    :key="item"
                    :download="item.name"
                    :href="item.url"
                  >
                    {{ item.name }}
                  </a>
                </el-form-item>
              </div>
              <div class="common-one-box">
                <el-form-item label="建议校验方案">
                  <span>{{ item.verificationProposal }}</span>
                </el-form-item>
              </div>
            </div>
            <!-- 专家分析 -- 指派 展示 -->
            <div v-if="item.auditType == 3">
              <div class="common-one-box">
                <el-form-item label="指派给">
                  <span>{{ item.reportGroupName }}</span>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>

        <!-- 机关系统 机关处置---展示 -->
        <div
          v-if="item.operationType == 7"
          class="history-item-box"
          :class="{ cursorPointer: !item.showDetail }"
          @click="showRecordDetail(item)"
        >
          <p v-if="!item.showDetail" class="border">
            {{ item.createdTime }} 由
            <span class="weight">{{ item.creator }}</span>
            {{ typeName[item.operationType] }}
          </p>
          <div class="border" v-else>
            <div class="record-title">
              <h5 class="cursorPointer" @click.stop="closeRecordDetail(item)">
                {{ item.createdTime }}
                <span>{{ item.creator }}</span>
                {{ typeName[item.operationType] }}
              </h5>
            </div>
            <div class="common-two-box">
              <el-form-item label="归置方案">
                <span>{{ homingSchemeListName[item.homingScheme] }}</span>
              </el-form-item>
              <el-form-item label="紧急程度">
                <span>{{ urgencyListName[item.urgency] }}</span>
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="处置信息">
                <span>{{ item.comments }}</span>
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="附件" v-if="item.commentsAccessoryList?.length > 0">
                <a
                  class="display-block"
                  v-for="item in item.commentsAccessoryList"
                  :key="item"
                  :download="item.name"
                  :href="item.url"
                >
                  {{ item.name }}
                </a>
              </el-form-item>
            </div>
            <div v-if="item.solution">
              <div class="common-one-box">
                <el-form-item label="解决方案">
                  <span>{{ item.solution }}</span>
                </el-form-item>
              </div>
              <div class="common-one-box">
                <el-form-item
                  label="附件"
                  v-if="item.solutionAccessoryList?.length > 0"
                >
                  <a
                    class="display-block"
                    v-for="item in item.solutionAccessoryList"
                    :key="item"
                    :download="item.name"
                    :href="item.url"
                  >
                    {{ item.name }}
                  </a>
                </el-form-item>
              </div>
              <div class="common-one-box">
                <el-form-item label="建议校验方案">
                  <span>{{ item.verificationProposal }}</span>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>

         <!-- 专家自己创建 -->
         <div
          v-if="item.operationType == 8"
          class="history-item-box"
          :class="{ cursorPointer: !item.showDetail }"
          @click="showRecordDetail(item)"
        >
          <p v-if="!item.showDetail" class="border">
            {{ item.createdTime }} 由
            <span class="weight">{{ item.creator }}</span>
            {{ typeName[item.operationType] }}
          </p>
          <div class="border" v-else>
            <div class="record-title">
              <h5 class="cursorPointer" @click.stop="closeRecordDetail(item)">
                {{ item.createdTime }}
                <span>{{ item.creator }}</span>
                {{ typeName[item.operationType] }}
              </h5>
            </div>
            <div class="common-one-box">
              <el-form-item label="问题定位">
                <span>{{ item.problemParts }}</span>
              </el-form-item>
            </div>
            <div class="common-two-box">
              <el-form-item label="问题分类">
                <span>{{ item.problemAttributesNames }}</span>
              </el-form-item>
              <el-form-item label="问题等级">
                <span>{{ problemLevelName[item.problemLevel] }}</span>
              </el-form-item>
            </div>
            <div class="common-one-box" v-if="item.accessoryList?.length > 0">
              <el-form-item label="问题附件">
                <a
                  class="display-block"
                  v-for="item in item.accessoryList"
                  :key="item"
                  :download="item.name"
                  :href="item.url"
                >
                  {{ item.name }}
                </a>
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="原因分析">
                <span>{{ item.causeAnalysis }}</span>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, nextTick } from 'vue'

export default defineComponent({
  props: {
    form: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    // 俩个补充显示是一样的    问题系统的校验 比 专家的多一个上报分析
    const typeName = [
      '',
      '补充',
      '审核',
      '校验',
      '补充',
      '分析',
      '校验',
      '处置',
      '分析',
      '关闭'
    ]
    const problemLevelName:any = {'1': '一般', '2':'严重', '3':'重大'}
    const homingSchemeListName:any = {'1': '装备新研论证','2': '装备改进提升','3': '装备采购','4': '装备技战术研究','5': '装备维修保障','6': '装备实验考核验证'}
    const urgencyListName:any = {'1': '立即处置','2': '本年度解决','3': '延期解决'}

    // 历史记录
    const isShowRecordDetail = ref(false)
    const showRecordDetail = (item: any) => {
      item.showDetail = true
    }
    const closeRecordDetail = (item: any) => {
      item.showDetail = false
    }
    return {
      isShowRecordDetail,
      typeName,
      problemLevelName,
      homingSchemeListName,
      urgencyListName,
      showRecordDetail,
      closeRecordDetail
    }
  }
})
</script>

<style lang="scss" scoped>
.problem-history-compoment {
  h4 {
    font-size: 17px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .common-one-box {
    padding-right: 30px;
    box-sizing: border-box;
  }
  .history-item-box {
    margin-bottom: 20px;
  }
  // 鼠标手指样式
  .cursorPointer {
    cursor: pointer;
  }
  .display-block {
    display: block;
  }
  a.display-block {
    color: #40be8c;
    &:hover{
      text-decoration:underline;
    }
  }
  .border {
    padding: 10px;
    border: 1px solid #ccc;
  }
  .weight {
    font-weight: bold;
  }
  .record-title {
    font-size: 15px;
    font-weight: bold;
    margin-left: 20px;
    margin-bottom: 10px;
  }
}
</style>
