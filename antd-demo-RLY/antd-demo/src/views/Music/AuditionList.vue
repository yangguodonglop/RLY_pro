<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-button type="primary" @click="addAdmin()">生成歌单</a-button>

        <a-range-picker
          style="margin-left: 20px;"
          :show-time="{ format: 'HH:mm' }"
          format
          :value="createValue"
          :placeholder="['确定意向开始时间', '确定意向结束时间']"
          @change="createChange"
        />
        <a-input
          v-model="songNameActive"
          style="margin-left: 20px;width:240px"
          placeholder="请输入歌曲名"
        />
        <a-input
          v-model="lyricistActive"
          style="margin-left: 20px;width:240px"
          placeholder="请输入作词者"
        />
        <a-input
          v-model="composerActive"
          style="margin-left: 20px;width:240px"
          placeholder="请输入作曲者"
        />
        <a-select
          v-model="styleValue"
          style="margin-left: 20px;width:240px"
          @change="handleChangeStyle"
          placeholder="请选择风格查询"
        >
          <template v-for="(item,index) in styleList">
            <a-select-option :value="item" v-bind:key="index">{{item}}</a-select-option>
          </template>
        </a-select>
      </a-col>
    </a-row>
    <a-row style="margin-top:20px;">
      <a-col :span="24" style="display: flex;
    justify-content: start;">
        <a-button type="primary" @click="queryInfo()">确认查询</a-button>
        <a-button type="primary" style="margin-left:20px" @click="resetInfo()">重置</a-button>
        <a-button type="primary" style="margin-left:20px" @click="checkList()">有效歌单</a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-table
          :pagination="false"
          :bordered="true"
          :columns="columns"
          rowKey="cr_songName"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :data-source="data"
          style="margin-top: 20px"
        >
          <!-- <a slot="name" slot-scope="text">{{ text }}</a>
          <span slot="customTitle"> <a-icon type="smile-o" />Name </span>-->
          <span slot="action" slot-scope="record">
            <a href="javascript:;" @click="tryAudition(record)">试听</a>

            <a href="javascript:;" style="margin-left:20px" @click="queryPartner(record)">查看试听情况</a>
            <a href="javascript:;" style="margin-left:20px" @click="toLock(record)">锁定</a>
          </span>
        </a-table>
      </a-col>
    </a-row>
    <a-row>
      <a-col>
        <div style="float:right">
          <a-pagination
            @change="onShowSizeChange"
            v-model="current"
            :total="totalNum"
            show-less-items
            style="margin-top:20px;"
          />
        </div>
      </a-col>
    </a-row>
     <a-modal
      title="有效歌单"
      :visible="visibleList"
      @ok="handleOkList"
      @cancel="handleCancelList"
      okText="确定"
      cancelText="取消"
      width="880px"
    >
    <a-row>
      <a-col :span="24">
        <a-table
          :pagination="false"
          :columns="columnsList"
          rowKey="cr_songName"
          :data-source="dataList"
          style="margin-top: 20px"
          :bordered="true"
        >
          <a slot="name" slot-scope="text">{{ text }}</a>
          <span slot="customTitle">
            <a-icon type="smile-o" />Name
          </span>
          <span slot="action" slot-scope="record">
            <a href="javascript:;" @click="copyAddress(record)">复制地址</a>
          
          </span>
        </a-table>
      </a-col>
    </a-row>
    <a-row>
      <a-col>
        <div style="float:right">
          <a-pagination
            @change="onShowSizeChangeList"
            v-model="currentList"
            :total="totalNumList"
            show-less-items
            style="margin-top:20px;"
          />
        </div>
      </a-col>
    </a-row>
     </a-modal>

    <a-modal
      :title="titleType"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="确定"
      cancelText="取消"
      width="680px"
    >
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        @submit="handleSubmit"
      >
        <a-form-item label="歌单名称">
          <a-input
            v-decorator="[
              'remake',
              { rules: [{ required: true, message: '请输入歌单名称!' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="歌单试听有效天数" v-if="passwordType">
          <a-input
            v-decorator="[
              'validTime',
              { rules: [{ required: true, message: '请输入歌单试听有效天数!' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="歌曲锁定天数" v-if="passwordType">
          <a-input
            v-decorator="[
              'lockTime',
              { rules: [{ required: true, message: '请输入歌单试听有效天数!' }] },
            ]"
          />
        </a-form-item>

        <a-form-item label="合作伙伴">
          <a-select
            style="width: 100%"
            @change="handleChange"
            v-decorator="[
              'partner',
              { rules: [{ required: true, message: '请选择合作伙伴!' }] },
            ]"
          >
            <template v-for="(item,index) in partnerList">
              <a-select-option :value="item.name" v-bind:key="index">{{item.NName}}</a-select-option>
            </template>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      title="试听伙伴"
      :visible="visiblePartner"
      :confirm-loading="confirmLoading"
      @ok="handleOkPartner"
      @cancel="handleCancelPartner"
      okText="确定"
      cancelText="取消"
    >
      <div>
        <a-row>
          <a-col :span="24">
            <a-table
              :pagination="false"
              :columns="columnPartner"
              :data-source="data1"
              :bordered="true"
              style="margin-top: 20px"
            >
              <a slot="name" slot-scope="text">{{ text }}</a>
              <span slot="customTitle">
                <a-icon type="smile-o" />Name
              </span>
              <span slot="action" slot-scope="record">
                <a
                  href="javascript:;"
                  style="margin-left:20px;"
                  @click="tryAudition(record)"
                >查看已经试听合作伙伴</a>
                <a href="javascript:;" @click="queryPartner(record)">查看已经试听合作伙伴</a>
              </span>
            </a-table>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <div style="float:right">
              <a-pagination
                @change="onShowSizeChange1"
                v-model="current1"
                :total="totalNum1"
                show-less-items
                style="margin-top:20px;"
              />
            </div>
          </a-col>
        </a-row>
      </div>
    </a-modal>
    <a-modal
      title="试听"
      :visible="visibleAudition"
      :confirm-loading="confirmLoading"
      @ok="handleOkAudition"
      @cancel="handleCancelAudition"
      okText="确定"
      cancelText="取消"
    >
      <div style="display: flex;justify-content: center;flex-direction: column;">
        <div style="display: flex;justify-content: center;">
          <audio :src="auditionCodeUrl" controls="controls" id="music1" controlslist="nodownload"></audio>
        </div>
        <div
          style="margin-top: 20px;text-indent: 20px;max-height: 600px;white-space: pre-wrap;overflow-y: auto;padding: 10px 20px;"
        >{{songText}}</div>
      </div>
    </a-modal>
    <a-modal
      title="复制地址"
      :visible="visibleUrl"
      :confirm-loading="confirmLoading"
      @ok="handleOkAddress"
      @cancel="handleCancelAddress"
      okText="确定"
      cancelText="取消"
    >
      <div style="display: flex;justify-content: center;flex-direction: column;">
        <div style="display: flex;justify-content: center;align-items: center;">
          <div
            style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:250px;"
          >{{customerAddress}}</div>
          <a-button
            type="primary"
            style="margin-left:20px"
            v-clipboard:copy="customerAddress"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >复制地址</a-button>
        </div>
      </div>
    </a-modal>
    <a-modal
      title="选择买入"
      :visible="visibleType"
      @ok="handleOkBuy"
      @cancel="handleCancelBuy"
      ok-text="确定"
      cancel-text="取消"
    >
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        @submit="handleSubmit1"
      >
        <a-form-item label="歌曲锁定天数" v-if="passwordType">
          <a-input
            v-decorator="[
              'lockTime',
              { rules: [{ required: true, message: '请输入歌单试听有效天数!' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="版权方式">
          <a-select
            default-value
            style="width: 100%"
            @change="handleChange2"
            v-decorator="[
          'nName1',
          { rules: [{ required: true, message: '请输入版权方式!' }] },
        ]"
          >
            <a-select-option
              v-for="(item, index) in queryCopyList"
              :key="index"
              :value="item"
            >{{item}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="合作方式">
          <a-select
            default-value
            style="width: 100%"
            @change="handleChange3"
            v-decorator="[
          'nName2',
          { rules: [{ required: true, message: '请输入合作方式!' }] },
        ]"
          >
            <a-select-option
              v-for="(item, index) in cooperationList"
              :key="index"
              :value="item"
            >{{item}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="合作伙伴">
          <a-select
            style="width: 100%"
            @change="handleChange"
            v-decorator="[
              'partner',
              { rules: [{ required: true, message: '请选择合作伙伴!' }] },
            ]"
          >
            <template v-for="(item,index) in partnerList">
              <a-select-option :value="item.name" v-bind:key="index">{{item.NName}}</a-select-option>
            </template>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {}
};
const treeData = [];
const columnPartner = [
  {
    dataIndex: "partner",
    title: "试听伙伴",
    key: "partner",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name1" }
  },
  {
    title: "试听时间",
    dataIndex: "timess",
    key: "timess"
  },
  {
    title: "试听次数",
    dataIndex: "listenTime",
    key: "listenTime"
  }
];
const columns = [
  {
    dataIndex: "id",
    title: "编号",
    key: "id",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name1" }
  },
  {
    title: "歌曲名称",
    dataIndex: "cr_songName",
    key: "cr_songName"
  },
  {
    title: "作词人",
    dataIndex: "cr_lyricist",
    key: "cr_lyricist"
  },
  {
    title: "作曲人",
    key: "cr_composer",
    dataIndex: "cr_composer",
    scopedSlots: { customRender: "tags" }
  },
  // {
  //   title: "编曲",
  //   key: "ar_account",
  //   dataIndex: "ar_account",
  //   scopedSlots: { customRender: "tags" }
  // },
  // {
  //   title: "录音",
  //   key: "rec_account",
  //   dataIndex: "rec_account",
  //   scopedSlots: { customRender: "tags" }
  // },
  // {
  //   title: "缩混",
  //   key: "cr_account",
  //   dataIndex: "cr_account",
  //   scopedSlots: { customRender: "tags" }
  // },
  {
    title: "歌曲风格",
    key: "cr_tag",
    dataIndex: "cr_tag",
    scopedSlots: { customRender: "tags" }
  },
  {
    title: "发布时间",
    key: "createTime",
    dataIndex: "createTime",
    scopedSlots: { customRender: "tags" }
  },
  {
    title: "结束时间",
    key: "updateTime",
    dataIndex: "updateTime",
    scopedSlots: { customRender: "tags" }
  },

  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];
const columnsList = [
  {
    dataIndex: "listName",
    title: "歌单名称",
    key: "listName",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name1" }
  },
  {
    title: "歌单创建者",
    dataIndex: "creator",
    key: "creator"
  },
  {
    title: "有效时长(天)",
    dataIndex: "validTime",
    key: "validTime"
  },
   {
    title: "锁定时长(天)",
    dataIndex: "lockTime",
    key: "lockTime"
  },
   {
    title: "合伙人账号",
    dataIndex: "partner",
    key: "partner"
  },
   {
    title: "歌单创建时间",
    dataIndex: "createTime",
    key: "createTime"
  },
   {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
 
];

const data = [];
const data1 = [];
const dataList = [];
import {
  apiUserList,
  apiRegistered,
  apiDeleteList,
  apiEditList,
  apiAuthorizationList,
  apiUserNameList,
  apiUploadlyric,
  apiUploadcomplete,
  apiCommitDemo,
  apigetSongInfo,
  apiUploadMix,
  apiUploadComplete,
  apiUploadCommitMix,
  apiDownloadFile,
  baseUrl,
  apiMakeAuditionList,
  apiQueryAuditionState,
  apiGetCustomer,
  apigetPublishSong,
  apiGetLyricContent,
  apiSongStyle,
  apiCopyright,
  apiCooperation,
  apiAddCooperative,
  apiAdminAddCooperative,
  apiAdminAuditionList,
  apiCommitRecordt
} from "@/request/api"; // 导入我们的api接口
import common from "@/request/util";

export default {
  data() {
    return {
      data,
      data1,
      dataList,
      columnsList,
      visibleList:false,
      columns,
      columnPartner,
      ModalText: "Content of the modal",
      visible: false,
      visibleEdit: false,
      confirmLoading: false,
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
      //       formLayout1: "horizontal",
      // form1: this.$form1.createForm(this, { name: "coordinated1" }),
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData,
      visibleAuthorization: false,
      text: "9999",
      passwordType: true,
      titleType: "新增",
      authorizationId: "",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      post: "post",
      fileList: [],
      uploading: false,
      fileList1: [],
      uploading1: false,
      lyricsCode: "",
      demoCode: "",
      mixCode: "",
      auditionCode: "",
      songName: "",
      current: 1,
      current1: 1,
      currentList: 1,
      totalNum: 0,
      totalNum1: 0,
      totalNumList: 0,
      rowSelection,
      visiblePartner: false,
      visibleSongList: false,
      visibleAudition: false,
      auditionCodeUrl: "",
      songNameList: [],
      selectedRowKeys: [],
      partnerList: [],
      songText: "",
      songNameActive: "",
      startTime: 0,
      endTime: 0,
      visibleUrl: false,
      customerAddress: "",
      createValue: [],
      styleValue: undefined,
      styleList: [],
      lyricistActive: "",
      composerActive: "",
      visibleType: false,
      queryCopyList: [],
      cooperationList: [],
      song: "",
      lockTime: 0

      // formEdit: this.$form.createForm(this, { name: "coordinated" }),
    };
  },
  watch: {
    checkedKeys(val) {
      console.log("onCheck", val);
    },
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    }
  },

  mounted: function() {
    this.querySongInfo();
    this.queryStyle();
    this.queryCopyright();
    this.queryCooperation();
    this.queryAuditionList();
  },
  methods: {
    //复制地址
    copyAddress(val){
         this.visibleUrl = true;
              this.customerAddress =
                "http://106.53.61.91:8990/clientLogin.html?type=" + val.url;

    },
    //查看有效歌单
    checkList(){
      this.visibleList=true
    },
    //锁定

    toLock(val) {
      let funcGroup = localStorage.getItem("funcGroup").split(",");

      if (
        funcGroup.includes("101") == true ||
        funcGroup.includes("100") == true ||
        funcGroup.includes("110") == true ||
        funcGroup.includes("111") == true
      ) {
        this.song = "";
        console.log(val);
        this.song = val.cr_songName;
        this.visibleType = true;
        this.queryClient();
      } else {
        this.$message.error("对不起，您暂无权限操作!");
      }
    },
    //确定买入
    handleOkBuy() {
      this.handleSubmit1();
      //this.visibleType = false
    },
    //取消买入
    handleCancelBuy() {
      this.visibleType = false;
    },
    handleChange2(val) {
      console.log(val);
      this.copyright = val;
    },
    handleChange3(val) {
      console.log(val);
      this.cooperative = val;
    },
    //版权列表
    queryCopyright() {
      const param = {
        key: localStorage.getItem("admin"),
        operation: 0,
        name: ""
      };
      apiCopyright(param).then(res => {
        if (res.state == 0) {
          this.queryCopyList = res.data;
          console.log(this.queryCopyList);
        } else {
          this.$message.error("获取客户列表失败!");
        }
      });
    },
    //合作方式列表
    queryCooperation() {
      const param = {
        key: localStorage.getItem("admin"),
        operation: 0,
        name: ""
      };
      apiCooperation(param).then(res => {
        if (res.state == 0) {
          this.cooperationList = res.data;
        } else {
          this.$message.error("获取客户列表失败!");
        }
      });
    },

    //获取嘻哈风格列表
    queryStyle() {
      const param = {
        key: localStorage.getItem("admin")
      };
      apiSongStyle(param).then(res => {
        if (res.state == 0) {
          this.styleList = res.data;
          this.styleList.unshift("全部");
          //this.queryAdminInfo();
        } else {
          this.$message.error("获取客户列表失败!");
        }
      });
    },
    //风格查询
    handleChangeStyle(value) {
      this.styleValue = value;
    },
    //确认复制地址弹窗
    handleOkAddress() {
      this.visibleUrl = false;
    },
    //关闭复制地址弹窗
    handleCancelAddress() {
      this.visibleUrl = false;
    },
    // 复制成功时的回调函数
    onCopy(e) {
      this.$message.success("内容已复制到剪切板！");
    },
    // 复制失败时的回调函数
    onError(e) {
      this.$message.error("抱歉，复制失败！");
    },
    //时间选择
    createChange(value, dateString) {
      this.createValue = value;

      let startTime = new Date(dateString[0]);
      let endTime = new Date(dateString[1]);
      this.startTime = parseInt(startTime.getTime() / 1000);
      this.endTime = parseInt(endTime.getTime() / 1000);
    },
    //状态选择
    handleChangeState(value) {
      this.stateValue = value;
    },
    //确认查询
    queryInfo() {
      this.querySongInfo();
      this.queryCopyright();
      this.queryCooperation();
    },
    //重置
    resetInfo() {
      this.startTime = 0;
      this.endTime = 0;
      (this.songNameActive = ""), (this.current = 1), (this.clien = "全部");
      this.createValue = [];
      this.styleValue = undefined;
      (this.lyricistActive = ""), (this.composerActive = "");
      this.querySongInfo();
    },
    //取消试听弹窗
    handleOkAudition() {
      var audio = document.getElementById("music1");
      audio.pause();
      this.visibleAudition = false;
    },
    handleCancelAudition() {
      var audio = document.getElementById("music1");
      audio.pause();
      this.visibleAudition = false;
    },
    //试听
    tryAudition(item) {
      this.songText = "";
      this.auditionCodeUrl =
        "http://106.53.61.91:8990/song/" + item.mix_auditionFile;
      this.visibleAudition = true;
      const param = {
        key: localStorage.getItem("admin"),
        code: item.cr_lyricsFile
      };
      apiGetLyricContent(param).then(res => {
        let str = res.content.split("plain")[1];
        let str1 = str.split("------Web")[0];

        this.songText = str1;
      });
    },
    //查询账户列表
    querySongInfo() {
      let clientActive = "";
      let styleValueActive = "";
      if (this.client === "全部") {
        this.client = "";
      }
      if (this.styleValue === "全部") {
        styleValueActive = "";
      } else {
        styleValueActive = this.styleValue;
      }
      const param = {
        key: localStorage.getItem("admin"),
        pageSize: 10,
        curPage: this.current,

        filter: {
          uploadTime: [this.startTime, this.endTime],
          songName: this.songNameActive,
          client: "",
          publisher: this.client,
          lyricist: this.lyricistActive,
          composer: this.composerActive,
          tag: styleValueActive,
           isProduct:false,
        }
      };
      apigetSongInfo(param).then(res => {
        this.totalNum = res.count;
        res.data.map((item, index) => {
          item["nums"] = index;
          item.mixName = baseUrl + "/song/" + item.mixName;
          if (item.createTime > 0) {
            item.createTime = common.getTimes(item.createTime * 1000);
          } else {
            item.createTime = "";
          }
          if (item.updateTime > 0) {
            item.updateTime = common.getTimes(item.updateTime * 1000);
          } else {
            item.updateTime = "";
          }
        });
        this.data = res.data;
      });
    },
    //查询有效歌单
    queryAuditionList() {
      // let clientActive = "";
      // let styleValueActive = "";
      // if (this.client === "全部") {
      //   this.client = "";
      // }
      // if (this.styleValue === "全部") {
      //   styleValueActive = "";
      // } else {
      //   styleValueActive = this.styleValue;
      // }
      const param = {
        key: localStorage.getItem("admin"),
        curPage: this.currentList,
        pageSize: 10,
        listName: "",
        creatorID: "",
        partner: "",
        songName: "",
        valid: 0
      };
      apiAdminAuditionList(param).then(res => {
        console.log(res);
        this.totalNumList = res.count;
        res.list.map((item, index) => {
         
          // item.mixName = baseUrl + "/song/" + item.mixName;
          if (item.createTime > 0) {
            item.createTime = common.getTimes(item.createTime * 1000);
          } else {
            item.createTime = "";
          }
         
        });
        this.dataList = res.list;
      });
    },
    //新增
    addAdmin() {
      if (this.songNameList.length == 0) {
        this.$message.error("请至少选择一首歌曲生成歌单！");
        return false;
      }
      if (this.songNameList.length > 50) {
        this.$message.error("选歌列表最多50首，您已经超出！");
        return false;
      }
      let funcGroup = localStorage.getItem("funcGroup").split(",");
      if (
        funcGroup.includes("110") == true ||
        funcGroup.includes("100") == true
      ) {
        this.queryClient();
        this.visible = true;
        this.passwordType = true;
        this.titleType = "新增";
        this.fileList1 = [];
        this.fileList = [];
        this.form.resetFields();
      } else {
        this.$message.error("对不起，您暂无该权限！");
        return false;
      }
    },
    //获取客户列表
    queryClient() {
      const param = {
        key: localStorage.getItem("admin")
      };
      apiGetCustomer(param).then(res => {
        if (res.state == 0) {
          this.partnerList = res.account;
          //this.queryAdminInfo();
        } else {
          this.$message.error("获取客户列表失败!");
        }
      });
    },
    handleChange() {},
    //打开编辑
    onEdit(item) {
      this.visible = true;
      this.passwordType = false;
      this.titleType = "编辑";

      this.form.resetFields();
      this.$nextTick(() => {
        this.form.setFieldsValue({
          userName: item.userName,
          nName: item.userName,
          telephone: item.telephone,
          weiXin: item.weiXin
        });
      });
    },
    //确认删除
    confirm(e) {
      const param = {
        key: localStorage.getItem("admin"),
        userName: [e.userName]
      };
      apiDeleteList(param).then(res => {
        if (res.state == 0) {
          this.visible = false;
          this.$message.success("删除成功！");
          this.queryAdminInfo();
        } else {
          this.$message.error("删除失败，请重新删除");
        }
      });
    },
    //取消删除
    cancel(e) {
      this.$message.error("Click on No");
    },
    //保存
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.songName = values.songName;
          const param = {
            key: localStorage.getItem("admin"),
            listName: values.remake,
            validTime: parseInt(values.validTime),
            partner: values.partner,
            songName: this.songNameList,
            lockTime: parseInt(values.lockTime)
          };
          // const param  {key:"xiaoMing",songName:"像我这样的人",”lyricist”:”毛不易”,”composer”:”毛不易”,”lyricsCode”:”ABCDEFSAAS~”,”demoCode”:”ADJIFAOQQ*&^^”}
          apiMakeAuditionList(param).then(res => {
            if (res.state == 0) {
              this.visibleUrl = true;
              this.customerAddress =
                "http://106.53.61.91:8990/clientLogin.html?type=" + res.url;
              // var tempwindow = window.open("_blank");
              // tempwindow.location =
              //   "http://106.53.61.91:8990/clientLogin.html?type=" + res.url;
            } else {
              this.$message.error("生成试听列表失败，请重新生成");
            }
          });
          this.visible = false;
        }
      });
    },
    //保存买入
    handleSubmit1() {
      // e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          const param = {
            key: localStorage.getItem("admin"),
            url: this.axiosUrl,
            partner: values.partner,
            lockTime: parseInt(values.lockTime),
            data: [
              {
                song: this.song,
                copyright: this.copyright,
                cooperative: this.cooperative
              }
            ]
          };
          // const param  {key:"xiaoMing",songName:"像我这样的人",”lyricist”:”毛不易”,”composer”:”毛不易”,”lyricsCode”:”ABCDEFSAAS~”,”demoCode”:”ADJIFAOQQ*&^^”}
          apiAdminAddCooperative(param).then(res => {
            console.log(res);
            let tempdata = res;
            if (tempdata.state == 0) {
              this.visibleType = false;
              this.visibleBuying = true;
              // this.buyTexting = `感谢您选择《${this.song}》歌曲，请在${this.lockTime}天内将该歌曲的版权协议，寄给我们，如果我们没有收到协议，将会在${this.lockTime}天后将该歌曲从新开放给所有合作伙伴，感谢理解！`;
              this.$message.success("锁定成功！");
              this.queryInfo(this.axiosUrl);
            } else {
              this.$message.error("对不起，您锁定失败！");
            }
          });
        }
      });
    },

    handleOk(e) {
      this.handleSubmit(e);
    },
    handleCancel(e) {
      this.visible = false;
    },
      handleOkList(e) {
      this.visibleList=false
    },
    handleCancelList(e) {
      this.visibleList = false;
    },
    handleOk1(e) {
      this.handleSubmit1(e);
    },
    handleCancel1(e) {
      this.visibleType = false;
    },
    //文件下载
    downLoadInfo(item) {
      var tempwindow = window.open("_blank");
      tempwindow.location = item.mixName + "";
    },
    //分页
    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.querySongInfo();
    },
    //合作伙伴分页
    onShowSizeChange1(current, pageSize) {
      this.current1 = current;
    },
    onShowSizeChangeList(current, pageSize) {
      this.currentList = current;
      this.queryAuditionList();
    },

    //生成试听歌单
    createSongList(item) {},
    //查看试听伙伴
    queryPartner(val) {
      const param = {
        key: localStorage.getItem("admin"),
        songName: val.cr_songName
      };
      apiQueryAuditionState(param).then(res => {
        if (res.state == 0) {
          this.data1 = res.data;
          this.data1.map(item => {
            item["timess"] = common.getTimes(item.time * 1000);
          });
        }
      });

      this.visiblePartner = true;
    },
    //关闭试听伙伴弹窗
    handleOkPartner() {
      this.visiblePartner = false;
    },
    //关闭试听伙伴弹窗
    handleCancelPartner() {
      this.visiblePartner = false;
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.songNameList = [];

      this.selectedRowKeys = selectedRowKeys;
      this.songNameList = selectedRowKeys;
      // selectedRows.map(item => {
      //   this.songNameList.push(item.cr_songName);
      // });
      console.log(this.songNameList);
    }
  }
};
</script>

<style></style>
