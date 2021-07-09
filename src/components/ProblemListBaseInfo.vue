  <template>
    <div class="problem-baseinfo-compoment">
      <el-form
        :model="form"
        label-width="160px"
        label-suffix="：">
          <div>
            <h4>问题基本记录信息：{{form.issueCode}}</h4>
            <div class="common-two-box">
              <el-form-item label="演习任务">
                <span>{{ form.taskName }}</span>
              </el-form-item>
              <el-form-item label="演习阶段">
                <span v-if="form.exercisePhaseId == '1'">准备阶段</span>
                <span v-if="form.exercisePhaseId == '2'">实施阶段</span>
                <span v-if="form.exercisePhaseId == '3'">结束阶段</span>
              </el-form-item>
            </div>
            <div class="common-two-box">
              <el-form-item label="发现单位">
                <span>{{ form.discoverUnitIdNames }}</span>
              </el-form-item>
              <el-form-item label="发现时间" class="date-picker">
                <span>{{ form.occurrenceTime }}</span>
              </el-form-item>
            </div>
            <div class="common-two-box">
              <el-form-item label="发现人">
                <span>{{ form.discoverPeople }}</span>
              </el-form-item>
              <el-form-item label="联系方式">
                <span>{{ form.contactNumber }}</span>
              </el-form-item>
            </div>
            <div class="common-two-box">
              <el-form-item label="问题装备型号">
                <span>{{ form.equipmentModelNames }}</span>
              </el-form-item>
              <el-form-item label="具体编号">
                <span>{{ form.equipmentNumber }}</span>
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="问题装备能力">
                <span>{{ form.equipmentCapabilityName }}</span>
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="发生环境">
                <span>{{ form.occurrenceEnvironment }}</span>
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="详细描述">
                <span>{{ form.detailedDescription }}</span>
              </el-form-item>
            </div>
            <div class="common-one-box">
              <el-form-item label="问题附件">
                <a class="display-block" v-for="(item) in form.accessoryList" :key="item" :download="item.name" :href="item.url">{{ item.name }}</a>
              </el-form-item>
            </div>
            <div class="common-two-box">
              <el-form-item label="记录人">
                <span>{{ form.creator }}</span>
              </el-form-item>
              <el-form-item label="记录时间">
                <span>{{form.createdTime}}</span>
              </el-form-item>
            </div>
          </div>
      </el-form>
    </div>
  </template>
  
  <script lang="ts">

    import { defineComponent, reactive, ref, computed, watch } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    export default defineComponent({
      props: {
        form: {
          type: Object,
          default: () => ({})
        }
      },
      setup() {
        const router = useRouter()
        const route = useRoute()
        return {
          route,
          router,
        }
      }
    })
  </script>
  
  <style lang="scss" scoped>
  .problem-baseinfo-compoment {
    h4 {
      font-size: 17px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    // 鼠标手指样式
    .cursorPointer {
      cursor: pointer;
    }
    .border {
      padding: 10px;
      border: 1px solid #ccc;
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
  }
  </style>
  