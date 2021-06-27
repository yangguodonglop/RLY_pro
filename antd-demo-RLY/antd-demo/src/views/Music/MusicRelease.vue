<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-range-picker
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
        <a-select
          v-model="client"
          style="margin-left: 20px;width:240px"
          @change="handleChangeClient"
          placeholder="请选择客户查询"
        >
          <template v-for="(item,index) in partnerList">
            <!-- {{item}} -->
            <!-- <a-select-option :value="item.name" v-bind:key="index">{{item.NName}}</a-select-option> -->
            <a-select-option :value="item.name" v-bind:key="index">{{item.NName}}</a-select-option>
          </template>
        </a-select>
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
        <a-select
          v-model="stateValue"
          style="margin-left: 20px;width:240px"
          placeholder="请选择发布状态查询"
          @change="handleChangeState"
        >
          <a-select-option value="0">全部</a-select-option>
          <a-select-option value="4">未收到合同</a-select-option>
          <a-select-option value="5">未收到首笔款</a-select-option>
          <a-select-option value="6">未发布</a-select-option>
          <a-select-option value="3">已发布</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row style="margin-top:20px;">
      <a-col :span="24" style="display: flex;
    justify-content: start;">
        <a-button type="primary" @click="queryInfo()">确认查询</a-button>
        <a-button type="primary" style="margin-left:20px" @click="resetInfo()">重置</a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-table
          :pagination="false"
          :columns="columns"
          :bordered="true"
          :data-source="data"
          style="margin-top: 20px"
        >
          <!-- <a slot="name" slot-scope="text">{{ text }}</a>
          <span slot="customTitle">
            <a-icon type="smile-o" />Name
          </span>-->
          <span slot="contractTime1" slot-scope="record">
            {{record.contractTime1}}
            <a-button
              size="small"
              type="primary"
              :disabled="record.contractTime1!==''"
              @click="createContract(record)"
            >确定确认收到合同</a-button>
          </span>
          <span slot="cashDeposit1" slot-scope="record">
            {{record.cashDeposit1}}
            <a-button
              size="small"
              type="primary"
              :disabled="record.cashDeposit1!==''"
              @click="createPayment(record)"
            >确定确认首笔付款</a-button>
          </span>
          <span slot="publishTime1" slot-scope="record">
            {{record.publishTime1}}
            <a-button
              size="small"
              type="primary"
              :disabled="record.publishTime1!==''"
              @click="createPublish(record)"
            >发布</a-button>
          </span>
          <span slot="action" slot-scope="record">
            <a-dropdown>
              <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
                操作
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;" @click="tryAudition(record)">选择试听</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="queryPartner(record)">查看试听情况</a>
                </a-menu-item>
                <!-- <a-menu-item v-if="record.contractTime!=0">
                  <a href="javascript:;" @click="createPublish(record)">发布</a>
                </a-menu-item>

                <a-menu-item >
                  <a href="javascript:;" @click="createContract(record)">确认收到合同</a>
                </a-menu-item>-->
                <a-menu-item v-if="record.contractTime===0">
                  <a href="javascript:;" @click="lengthLock(record)">延期锁定</a>
                </a-menu-item>
                <a-menu-item v-if="record.publishTime===0">
                  <a href="javascript:;" @click="updateSongInfo(record)">修改歌曲信息</a>
                </a-menu-item>
                <a-menu-item>
                  <a-popconfirm
                    title="是否解除锁定?"
                    ok-text="确认"
                    cancel-text="取消"
                    @confirm="confirmremoveLockSong(record)"
                    @cancel="cancelremoveLockSong(record)"
                  >
                    <a href="#">解除锁定</a>
                  </a-popconfirm>
                  <a href="javascript:;" @click="removeLockSong(record)"></a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
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
            ></a-table>
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
      title="修改信息"
      :visible="visibleSong"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="确定"
      cancelText="取消"
    >
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        @submit="handleSubmit"
      >
        <a-form-item label="歌曲名称">
          <a-input :disabled="true" v-model="songNamess" />
        </a-form-item>
        <a-form-item label="作曲者">
          <a-input v-model="composerss" />
        </a-form-item>
        <a-form-item label="作词者">
          <a-input v-model="librettistss" />
        </a-form-item>
        <a-form-item label="合作伙伴">
          <a-select style="width: 100%" @change="handleChangeactive" v-model="buyerss">
            <template v-for="(item,index) in partnerList1">
              <a-select-option :value="item.name" v-bind:key="index">{{item.NName}}</a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <!-- <a-form-item label="发行商">
          <a-input
          v-model="buyerss"
         
          />
        </a-form-item>-->

        <a-form-item label="歌曲风格">
          <a-select style="width: 100%" mode="tags" @change="handleChangeClient3" v-model="tagss">
            <template v-for="(item,index) in styleList">
              <a-select-option :value="item" v-bind:key="index">{{item}}</a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item label="合作模式">
          <a-select style="width: 100%" @change="handleChangeClient1" v-model="collaborateModess">
            <template v-for="(item,index) in styleListHezuo">
              <a-select-option :value="item" v-bind:key="index">{{item}}</a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item label="版权模式">
          <a-select style="width: 100%" @change="handleChangeClient2" v-model="copyrightss">
            <template v-for="(item,index) in styleListBanquan">
              <a-select-option :value="item" v-bind:key="index">{{item}}</a-select-option>
            </template>
          </a-select>
        </a-form-item>

        <a-form-item label="歌词上传">
          <a-upload
            :file-list="fileList1"
            :remove="handleRemove1"
            :before-upload="beforeUpload1"
            v-model="auditionCodesss"
          >
            <a-button>
              <a-icon type="upload" />点击上传
            </a-button>
          </a-upload>
          <a-button
            type="primary"
            :disabled="fileList1.length === 0"
            :loading="uploading1"
            style="margin-top: 16px"
            @click="handleUpload1"
          >{{ uploading1? '上传中' : '开始上传' }}</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
        <a-modal
      title="延迟锁定"
      :visible="visibleLengthLock"
      @ok="handleOkLengthLock"
      @cancel="handleCancelLengthLock"
      okText="确定"
      cancelText="取消"
    >
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        @submit="handleSubmit1"
      >
        <a-form-item label="歌曲名称">
          <a-input :disabled="true" v-model="lockName" />
        </a-form-item>
        <a-form-item label="延迟天数">
          <a-input type="number" maxLength="7" v-model="lockDays" />
        </a-form-item>
       
    
      </a-form>
    </a-modal>
  </div>
</template>

<script>
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
const data1 = [];
const treeData = [
  { key: 100, title: "超级管理员", func: [2100, 2101] },
  { key: 101, title: "总监制", func: [2200, 2201, 2202, 2203] },
  { key: 102, title: "制作人", func: [2301, 2300, 2302] },
  { key: 103, title: "词曲作者", func: [2400, 2401, 2402] },
  { key: 104, title: "编曲组长", func: [2401] },
  { key: 105, title: "编曲师", func: [2501, 2502] },
  { key: 106, title: "录音组长", func: [2503, 2501] },
  { key: 107, title: "录音师", func: [2601, 2502] },
  { key: 108, title: "混音组长", func: [2901, 2902] },
  { key: 109, title: "混音师", func: [2502] },
  { key: 110, title: "发行组长", func: [2502] },
  { key: 111, title: "发行专员", func: [2502] },
  { key: 112, title: "法务", func: [2502] },
  { key: 113, title: "财务", func: [2502] },
  { key: 114, title: "客户", func: [2502] }
];
const columns = [
  {
    dataIndex: "songName",
    title: "歌曲名",
    key: "songName",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name1" }
  },

  {
    title: "发行商",
    dataIndex: "buyer",
    key: "buyer"
  },
  {
    title: "合作模式",
    dataIndex: "collaborateMode",
    key: "collaborateMode"
  },
  {
    title: "版权模式",
    dataIndex: "copyright",
    key: "copyright"
  },
  {
    title: "歌曲风格",
    key: "tag",
    dataIndex: "tag",
    scopedSlots: { customRender: "tags" }
  },
  {
    title: "确定意向时间",
    dataIndex: "createTime1",
    key: "createTime1"
  },
  {
    title: "签合同时间",

    key: "contractTime1",
    scopedSlots: { customRender: "contractTime1" }
  },

  {
    title: "收到首笔款时间",
    key: "cashDeposit1",
    scopedSlots: { customRender: "cashDeposit1" }
  },

  {
    title: "发行时间",
    key: "publishTime1",
    scopedSlots: { customRender: "publishTime1" }
  },
  {
    title: "锁定时间",
    key: "lockingTime",
    dataIndex: "lockingTime",
    scopedSlots: { customRender: "tags" }
  },
  {
    title: "发行人员",
    key: "creatorAccount",
    dataIndex: "creatorAccount",
    scopedSlots: { customRender: "tags" }
  },

  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

const data = [];
import {
  apiUserList,
  apiRegistered,
  apiDeleteList,
  apiEditList,
  apiAuthorizationList,
  apiUserNameList,
  apiCommitDemo,
  apigetSongInfo,
  apiUploadMix,
  apiUploadComplete,
  apiUploadCommitMix,
  apiDownloadFile,
  baseUrl,
  apiCheckWork,
  apiQueryAuditionState,
  apigetPublishSong,
  apiUploadLyric,
  apiGetSongLyric,
  apiGetCustomer,
  apiSongStyle,
  apiGetLyricContent,
  apiRemoveLockSong,
  apiUpdateSongInfo,
  apiGetSongInfo,
  apiCopyright,
  apiCooperation,
  apiLengthLock
} from "@/request/api"; // 导入我们的api接口
import common from "@/request/util";

export default {
  data() {
    return {
      data,
      data1,
      columns,
      visibleLengthLock:false,
      columnPartner,
      ModalText: "Content of the modal",
      visible: false,
      visibleEdit: false,
      confirmLoading: false,
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
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
      lyricCode: "",
      songName: "",
      current: 1,
      totalNum: 0,
      visibleAudition: false,
      auditionCodeUrl: "",
      visiblePartner: false,
      current1: 1,
      totalNum1: 2,
      tags: [],
      songText: "",
      songNameActive: "",
      stateValue: undefined,
      startTime: 0,
      endTime: 0,
      partnerList: [],
      partnerList1: [],
      styleList: [],
      styleListHezuo: [],
      styleListBanquan: [],
      client: undefined,
      styleValue: undefined,
      createValue: [],
      visibleSong: false,
      songNamess: "",
      composerss: "",
      librettistss: "",
      tagss: [],
      copyrightss: "",
      auditionCodesss: "",
      collaborateModess: "",
      collaborateMode: "",
      copyright: "",
      buyerss: "",
      lockName:"",
      lockDays:1,

      // formEdit: this.$form.createForm(this, { name: "coordinated" }),
    };
  },
  watch: {
    checkedKeys(val) {
      console.log("onCheck", val);
    }
  },

  mounted: function() {
    this.querySongInfo();
    this.queryClient();
    this.queryStyle();
  },
  methods: {
    //延期锁定
    lengthLock(val){
      this.visibleLengthLock = true
      this.lockName=val.songName

    },
     //确认延期锁定
    handleOkLengthLock(e) {
      this.handleSubmit1(e);
    },
    //取消延期锁定
    handleCancelLengthLock(e) {
      this.visibleLengthLock = false;
    },
      //延期锁定保存
    handleSubmit1(e) {
      e.preventDefault();
      const param={
  key: localStorage.getItem("admin"),
        songName: this.lockName,
        days:parseInt(this.lockDays) 
      }
       

       apiLengthLock(param).then(res => {
        if (res.state == 0) {
          console.log(res);
          this.visibleLengthLock = false;
          this.$message.success("延迟锁定成功");
          this.querySongInfo();
        } else {
          this.$message.error("延迟锁定成功！");
        }
      });
    },
    //确认更新
    handleOk(e) {
      this.handleSubmit(e);
    },
    //取消更新
    handleCancel(e) {
      this.visibleSong = false;
    },
    //保存
    handleSubmit(e) {
      e.preventDefault();
      this.uploadMix();

  
    },
    //更新缩混
    uploadMix() {
      let tempArr = [];
      this.tagss.filter(item => {
        tempArr.push(item);
      });

      const param = {
        key: localStorage.getItem("admin"),
        songName: this.songNamess,
        lyricist: this.librettistss,
        lyricsCode: this.lyricCode,
        composer: this.composerss,
        tag: tempArr,
        buyer: this.buyerss,
        collaborateMode: this.collaborateModess,
        copyright: this.copyrightss
      };
      apiUpdateSongInfo(param).then(res => {
        if (res.state == 0) {
          console.log(res);
          this.visibleSong = false;
          this.$message.success("更新成功");
          this.querySongInfo();
        } else {
          this.$message.error("更新失败，请重新上传！");
        }
      });
    },
    //上传混MP3
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },
    handleUpload() {
      let _this = this;

      const { fileList } = this;
      let formData = new FormData();
      formData = null;
      formData = new FormData();
      fileList.forEach(file => {
        formData.append("files[]", file);
      });
      _this.uploading = true;

      //return false
      // You can use any AJAX library you like
      apiUploadComplete(formData).then(res => {
        if (res.state == 0) {
          _this.uploading = false;
          _this.disabledActive1 = true;
          // if (_this.disabledActive1 == true && _this.disabledActive2 == true) {
          //   this.disabledActive = false;
          // }
          //this.mixCode = res.code;
          this.auditionCode = res.code;

          //localStorage.setItem("admin",res.userName)
          //this.$router.push("/Authority/UserList");
        } else {
          this.$message.error("上传失败，请重新上传！");
        }
      });
    },
    //上传歌词
    handleRemove1(file) {
      const index = this.fileList1.indexOf(file);
      const newFileList = this.fileList1.slice();
      newFileList.splice(index, 1);
      this.fileList1 = newFileList;
    },
    beforeUpload1(file) {
      this.fileList1 = [...this.fileList1, file];
      return false;
    },
    handleUpload1() {
      let _this = this;

      const { fileList1 } = this;
      let formData1 = new FormData();
      formData1 = null;
      formData1 = new FormData();
      fileList1.forEach(file => {
        formData1.append("files[]", file);
      });
      this.uploading1 = true;
      // You can use any AJAX library you like
      apiUploadLyric(formData1).then(res => {
        if (res.state == 0) {
          this.lyricCode = res.code;
          _this.uploading1 = false;
          // _this.disabledActive2 = true;
          // if (_this.disabledActive1 == true && _this.disabledActive2 == true) {
          //   this.disabledActive = false;
          // }

          // localStorage.setItem("admin", res.userName);
          //this.$router.push("/Authority/UserList");
        } else {
          this.$message.error("上传失败，请重新上传！");
        }
      });
    },
    //修改歌曲信息
    updateSongInfo(val) {
      this.queryHezuo();
      this.queryBanquan();
      console.log(val);
      //   this.form.getFieldDecorator.songName=val.val.songName

      // this.tagsss=val.
      const param = {
        key: localStorage.getItem("admin"),

        songName: val.songName
      };
      apiGetSongInfo(param).then(res => {
        console.log(res);
        this.partnerList1.filter(item => {
          if (res.data.buyer === item.NName) {
            this.buyerss = item.name;
          }
        });
        console.log(this.buyerss);
        this.songNamess = res.data.songName;

        this.composerss = res.data.composer;
        this.collaborateModess = res.data.collaborateMode;
        this.tagss = res.data.tag.split(",");
        this.librettistss = res.data.lyricist;
        this.copyrightss = res.data.copyright;

        this.visibleSong = true;
      });
    },
    //解除锁定
    confirmremoveLockSong(val) {
      console.log(val);
      const param = {
        key: localStorage.getItem("admin"),

        song: [val.songName]
      };
      apiRemoveLockSong(param).then(res => {
        console.log(res);
        if (res.state == 0) {
          if (res.successCount > 0) {
            this.$message.success("解除锁定成功!");
            this.querySongInfo();
          } else {
            this.$message.error("解除锁定失败失败!");
            this.querySongInfo();
          }
        } else {
          this.$message.error("解除锁定失败失败!");
          this.querySongInfo();
        }
      });
    },
    //取消锁定
    cancelremoveLockSong(val) {},
    //获取客户列表
    queryClient() {
      const param = {
        key: localStorage.getItem("admin")
      };
      apiGetCustomer(param).then(res => {
        if (res.state == 0) {
          this.partnerList = res.account;
          this.partnerList1 = res.account;
          let obj = {
            name: "",
            NName: "全部"
          };

          this.partnerList.unshift(obj);
          //this.queryAdminInfo();
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
    //获取合作方式
    queryHezuo() {
      const param = {
        key: localStorage.getItem("admin"),
        operation: 0,
        name: ""
      };
      apiCooperation(param).then(res => {
        console.log(res);
        if (res.state == 0) {
          this.styleListHezuo = res.data;
          //this.queryAdminInfo();
        } else {
          this.$message.error("获取合作方式列表失败!");
        }
      });
    },
    //获取版权
    queryBanquan() {
      const param = {
        key: localStorage.getItem("admin"),
        operation: 0,
        name: ""
      };
      apiCopyright(param).then(res => {
        if (res.state == 0) {
          console.log(res);
          this.styleListBanquan = res.data;
          //this.queryAdminInfo();
        } else {
          this.$message.error("获取版权列表失败!");
        }
      });
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
      console.log(value);
      this.stateValue = value + "";
    },
    //客户选择
    handleChangeClient(value) {
      console.log(value);
      this.client = value;
    },
    //客户选择
    handleChangeactive(value) {
      console.log(value);
      this.buyerss = value;
    },
    //客户选择
    handleChangeClient1(value) {
      console.log(value);
      this.collaborateModess = value;
    },
    //客户选择
    handleChangeClient2(value) {
      console.log(value);
      this.copyrightss = value;
    },
    //客户选择
    handleChangeClient3(value) {
      console.log(value);
      this.tagss = value;
    },
    //风格查询
    handleChangeStyle(value) {
      console.log(value);
      this.styleValue = value;
    },

    //确认查询
    queryInfo() {
      this.querySongInfo();
    },
    //重置
    resetInfo() {
      this.startTime = 0;
      this.endTime = 0;
      (this.songNameActive = ""), (this.current = 1);
      this.stateValue = undefined;
      this.styleValue = undefined;
      this.client = undefined;
      this.createValue = [];
      this.querySongInfo();
    },
    //合作伙伴分页
    onShowSizeChange1(current, pageSize) {
      this.current1 = current;
      console.log(current, pageSize);
    },
    //生成试听歌单
    createSongList(item) {},
    //查看试听伙伴
    queryPartner(val) {
      const param = {
        key: localStorage.getItem("admin"),
        songName: val.songName
      };
      apiQueryAuditionState(param).then(res => {
        console.log(res);
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
    handleCancelPartner() {
      this.visiblePartner = false;
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
    // //试听
    // tryAudition(item) {
    //   console.log(item);
    //   this.auditionCodeUrl = "http://106.53.61.91:8990/song/" + item.tryListen;
    //   this.visibleAudition = true;
    // },
    //试听
    tryAudition(item) {
      this.songText = "";
      this.auditionCodeUrl =
        "http://106.53.61.91:8990/song/" + item.auditionFile;
      this.visibleAudition = true;
      const param = {
        key: localStorage.getItem("admin"),
        code: item.lyricsFile
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
        clientActive = "";
      } else {
        clientActive = this.client;
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
          publishTime: [this.startTime, this.endTime],
          songName: this.songNameActive,
          publishStatus: parseInt(this.stateValue),
          publisher: clientActive,
          tag: styleValueActive
        }
        // filter:{}
      };
      apigetPublishSong(param).then(res => {
        this.totalNum = res.count;
        res.data.filter((item, index) => {
          item.mixName = baseUrl + "/song/" + item.mixName;
          if (
            item.contractTime > 0 ||
            item.cashDeposit > 0 ||
            item.publishTime > 0
          ) {
            item["lockingTime"] = "";
          } else {
            if (item.createTime > 0) {
              let nowlockTime = parseInt(item.lockTime);
              let tempTime = 0;
              tempTime = parseInt(60 * 60 * 24 * nowlockTime) + item.createTime;
              let tempTime1 = parseInt(new Date().getTime() / 1000);
              let tempTime2 = item.createTime + tempTime;

              item["lockingTime"] = common.SecondToDate(tempTime - tempTime1);
            } else {
              item["lockingTime"] = "";
            }
          }

          if (item.contractTime > 0) {
            item["contractTime1"] = common.getTimes(item.contractTime * 1000);
          } else {
            item["contractTime1"] = "";
          }
          if (item.cashDeposit > 0) {
            item["cashDeposit1"] = common.getTimes(item.cashDeposit * 1000);
          } else {
            item["cashDeposit1"] = "";
          }
          if (item.publishTime > 0) {
            item["publishTime1"] = common.getTimes(item.publishTime * 1000);
          } else {
            item["publishTime1"] = "";
          }
          if (item.createTime > 0) {
            item["createTime1"] = common.getTimes(item.createTime * 1000);
          } else {
            item["createTime1"] = "";
          }
        });

        this.data = res.data;
      });
    },
    //新增
    addAdmin() {
      let funcGroup = localStorage.getItem("funcGroup").split(",");

      if (
        funcGroup.includes("108") == true ||
        funcGroup.includes("100") == true
      ) {
        this.visible = true;
        this.passwordType = true;
        this.titleType = "新增";
        this.fileList1 = [];
        this.fileList = [];
        this.form.resetFields();
      } else {
        this.$message.error("对不起，您暂无该上传权限！");
        return false;
      }
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
      console.log(e);
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
      this.uploadMix();

      // this.form.validateFields((err, values) => {
      //   this.tags = values.tags;
      //   if (!err) {
      //     this.songName = values.songName;
      //     this.uploadMix();
      //   }
      // });
    },

    // handleOk(e) {
    //   this.handleSubmit(e);
    // },
    //上传缩混
    // uploadMix() {
    //   let tempArr = [];
    //   this.tags.filter(item => {
    //     tempArr.push(parseInt(item));
    //   });
    //   const param = {
    //     key: localStorage.getItem("admin"),
    //     songName: this.songName,
    //     tags: tempArr,
    //     // lyricist: "毛不易",
    //     // composer: "毛不易",
    //     //mixCode: this.mixCode,
    //     auditionCode: this.auditionCode,
    //     lyricCode: this.lyricCode
    //   };
    //   apiUploadCommitMix(param).then(res => {
    //     if (res.state == 0) {
    //       this.visible = false;
    //       this.$message.success("上传成功");
    //       this.querySongInfo();
    //     } else {
    //       this.$message.error("上传失败，请重新上传");
    //     }
    //   });
    // },

    //文件下载
    downLoadInfo(item) {
      // // alert("(((")
      // const param={
      //     key: localStorage.getItem("admin")
      // }
      var tempwindow = window.open("_blank");
      tempwindow.location = item.mixName + "";
      //  window.location.href =item.mixName+'';
      // apiDownloadFile(param).then(res=>{
      //   console.log(res)

      // })
    },
    //分页
    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.querySongInfo();
      console.log(current, pageSize);
    },
    //生成试听歌单
    createSongList(item) {
      this.$router.push("/Music/UserList2");
    },
    //确认收到合同
    createContract(item) {
      let funcGroup = localStorage.getItem("funcGroup").split(",");
      if (
        funcGroup.includes("112") == true ||
        funcGroup.includes("100") == true
      ) {
        const param = {
          key: localStorage.getItem("admin"),
          songName: item.songName,
          step: "contract",
          operation: "pass"
        };
        apiCheckWork(param).then(res => {
          if (res.state == 0) {
            this.$message.success("确认收到合同成功");
          } else {
            this.$message.error("确认收到合同失败");
          }
          this.querySongInfo();
        });
      } else {
        this.$message.error("对不起，您暂无该权限！");
        return false;
      }
    },
    //确认发行
    createPublish(item) {
      let funcGroup = localStorage.getItem("funcGroup").split(",");
      if (
        funcGroup.includes("110") == true ||
        funcGroup.includes("100") == true
      ) {
        const param = {
          key: localStorage.getItem("admin"),
          songName: item.songName,
          step: "publish",
          operation: "pass"
        };
        apiCheckWork(param).then(res => {
          if (res.state == 0) {
            this.$message.success("发布成功");
          } else {
            this.$message.error("发布失败");
          }
          this.querySongInfo();
        });
      } else {
        this.$message.error("对不起，您暂无该权限！");
        return false;
      }
    },
    //确认收到首笔付款
    createPayment(item) {
      let funcGroup = localStorage.getItem("funcGroup").split(",");
      if (
        funcGroup.includes("113") == true ||
        funcGroup.includes("100") == true
      ) {
        const param = {
          key: localStorage.getItem("admin"),
          songName: item.songName,
          step: "payment",
          operation: "pass"
        };
        apiCheckWork(param).then(res => {
          if (res.state == 0) {
            this.$message.success("确认收到首笔付款成功");
          } else {
            this.$message.error("确认收到首笔付款失败");
          }
        });
        this.querySongInfo();
      } else {
        this.$message.error("对不起，您暂无该权限！");
        return false;
      }
    }
  }
};
</script>

<style></style>
