<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-button type="primary" @click="addAdmin">新增账户</a-button>
        <a-button style="margin-left:20px;" type="primary" @click="addvisibleCopyright">新增版权合作</a-button>
        <a-button style="margin-left:20px;" type="primary" @click="addvisibleCooperation">新增合作方式</a-button>
        <a-button style="margin-left:20px;" type="primary" @click="addvisibleStyle">新增歌曲风格</a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-table :columns="columns" :data-source="data" style="margin-top:20px">
          <a slot="name" slot-scope="text">{{ text }}</a>
          <span slot="customTitle">
            <a-icon type="smile-o" />Name
          </span>

          <span slot="action" slot-scope="text, record">
            <a @click="onEdit(record)">编辑</a>
            <a-divider type="vertical" />

            <a-popconfirm
              title="确定要删除此账号？"
              ok-text="Yes"
              cancel-text="No"
              @confirm="confirm(record)"
              @cancel="cancel(record)"
            >
              <a href="#">删除</a>
            </a-popconfirm>

            <a-divider type="vertical" />
            <a @click="onAuthorization(record)">授权</a>
          </span>
        </a-table>
      </a-col>
    </a-row>

    <a-modal
      :title="titleType"
      :visible="visible"
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
        <a-form-item label="用户名">
          <a-input
            :disabled="disabledType"
            v-decorator="['userName', { rules: [{ required: true, message: '请输入用户名!' }] }]"
          />
        </a-form-item>
        <a-form-item label="密码">
          <a-input v-decorator="['password', { rules: [{ required: true, message: '请输入密码!' }] }]" />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-decorator="['nName', { rules: [{ required: true, message: '请输入姓名!' }] }]" />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input
            v-decorator="['telephone', { rules: [{ required: true, message: '请输入手机号!' }] }]"
          />
        </a-form-item>
        <a-form-item label="微信号">
          <a-input v-decorator="['weiXin', { rules: [{ required: true, message: '请输入微信号!' }] }]" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      title="新增版权方式"
      :visible="visibleCopyright"
      @ok="handleOkCopyright"
      @cancel="handleCancelCopyright"
      okText="确定"
      cancelText="取消"
    >
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="新增版权方式">
          <div style="height:40px; display: flex;justify-content: flex-start;align-items: center;">
            <a-input v-model="copyrightText" />
            <a-button style="margin-left:20px;" type="primary" @click="addCopyright">确定</a-button>
          </div>
        </a-form-item>
        <a-row>
          <a-col :span="24">
            <a-table
              :columns="columns1"
              :data-source="data1"
              style="margin-top:20px"
              :pagination="false"
            >
              <a slot="name" slot-scope="text">{{ text }}</a>
              <span slot="customTitle">
                <a-icon type="smile-o" />Name
              </span>

              <span slot="action" slot-scope="text, record">
                <a-popconfirm
                  title="确定要删除此方式？"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="confirmCopyright(record)"
                  @cancel="cancelCopyright(record)"
                >
                  <a href="#">删除</a>
                </a-popconfirm>
                <a href="#" style="margin-left:20px" @click="toEdit(record)">编辑</a>
              </span>
            </a-table>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal
      title="新增合作方式"
      :visible="visibleCooperation"
      @ok="handleOkCooperation"
      @cancel="handleCancelCooperation"
      okText="确定"
      cancelText="取消"
    >
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="新增合作方式">
          <div style="height:40px; display: flex;justify-content: flex-start;align-items: center;">
            <a-input v-model="cooperationText" />
            <a-button style="margin-left:20px;" type="primary" @click="addCooperation">确定</a-button>
          </div>
        </a-form-item>
        <a-row>
          <a-col :span="24">
            <a-table
              :columns="columns2"
              :data-source="data2"
              style="margin-top:20px"
              :pagination="false"
            >
              <a slot="name" slot-scope="text">{{ text }}</a>
              <span slot="customTitle">
                <a-icon type="smile-o" />Name
              </span>

              <span slot="action" slot-scope="text, record">
                <a-popconfirm
                  title="确定要删除此方式？"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="confirmCooperation(record)"
                  @cancel="cancelCooperation(record)"
                >
                  <a href="#">删除</a>
                </a-popconfirm>
                <a href="#" style="margin-left:20px" @click="toEditCooperation(record)">编辑</a>
              </span>
            </a-table>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal
      title="新增歌曲风格"
      :visible="visibleStyle"
      @ok="handleOkAddstyle"
      @cancel="handleAddstyle"
      okText="确定"
      cancelText="取消"
    >
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="新增歌曲风格">
          <div style="height:40px; display: flex;justify-content: flex-start;align-items: center;">
            <a-input v-model="songStyle" />
            <a-button style="margin-left:20px;" type="primary" @click="addStyle">确定</a-button>
          </div>
        </a-form-item>
        <a-row>
          <a-col :span="24">
            <a-table
              :columns="columns2"
              :data-source="data3"
              style="margin-top:20px"
              :pagination="false"
            >
              <a slot="name" slot-scope="text">{{ text }}</a>
              <span slot="customTitle">
                <a-icon type="smile-o" />Name
              </span>

              <span slot="action" slot-scope="text, record">
                <a-popconfirm
                  title="确定要删除此风格？"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="confirmAddstyle(record)"
                  @cancel="cancelAddstyle(record)"
                >
                  <a href="#">删除</a>
                </a-popconfirm>
                                <a href="#" style="margin-left:20px" @click="toEditStyle(record)">编辑</a>

              </span>
            </a-table>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal
      title="授权"
      :visible="visibleAuthorization"
      okText="确定"
      cancelText="取消"
      @ok="handleOkTree"
      @cancel="handleCancel1"
    >
      <a-row>
        <a-col :span="24">
          <a-tree
            v-model="checkedKeys"
            checkable
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :selected-keys="selectedKeys"
            :tree-data="treeData"
            @expand="onExpand"
            @select="onSelect"
          />
        </a-col>
      </a-row>
    </a-modal>
    <a-modal
      title="编辑"
      :visible="editCopyright"
      okText="确定"
      cancelText="取消"
      @ok="handleOkEditCopyright"
      @cancel="handleCancelEditCopyright"
    >
      <a-row>
        <a-col :span="24">
          <a-input v-model="editCopyrightText" />
        </a-col>
      </a-row>
    </a-modal>
    <a-modal
      title="编辑"
      :visible="editCooperation"
      okText="确定"
      cancelText="取消"
      @ok="handleOkEditCooperation"
      @cancel="handleCancelEditCooperation"
    >
      <a-row>
        <a-col :span="24">
          <a-input v-model="editCooperationText" />
        </a-col>
      </a-row>
    </a-modal>
     <a-modal
      title="编辑"
      :visible="editStyle"
      okText="确定"
      cancelText="取消"
      @ok="handleOkEditStyle"
      @cancel="handleCancelEditStyle"
    >
      <a-row>
        <a-col :span="24">
          <a-input v-model="editStyleText" />
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>


<script>
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
    dataIndex: "userName",
    title: "账户名",
    key: "userName",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name1" }
  },
  {
    title: "姓名",
    dataIndex: "nName",
    key: "nName"
  },
  {
    title: "手机号码",
    dataIndex: "telephone",
    key: "telephone"
  },
  {
    title: "微信",
    key: "weiXin",
    dataIndex: "weiXin",
    scopedSlots: { customRender: "tags" }
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];
const columns1 = [
  {
    dataIndex: "name",
    title: "名称",
    key: "keys",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name1" }
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];
const columns2 = [
  {
    dataIndex: "name",
    title: "名称",
    key: "keys",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name1" }
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

const data = [];
const data1 = [];
const data2 = [];
const data3 = [];
import {
  apiUserList,
  apiRegistered,
  apiDeleteList,
  apiEditList,
  apiAuthorizationList,
  apiUserNameList,
  apiCopyright,
  apiCooperation,
  apiSongStyle
} from "@/request/api"; // 导入我们的api接口

export default {
  data() {
    return {
      data,
      data1,
      data2,
      data3,
      columns,
      columns1,
      columns2,
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
      visibleCopyright: false,
      visibleCooperation: false,
      copyrightText: "",
      cooperationText: "",
      songStyle: "",
      disabledType: false,
      visibleStyle: false,
      editCopyright: false,
      editStyle:false,
      editCopyrightText: "",
      editStyleText:"",
      editStyleTextOld:"",
      editCopyrightTextOld: "",
      editCooperation: false,
      editCooperationText: "",
      editCooperationTextOld: ""
      // formEdit: this.$form.createForm(this, { name: "coordinated" }),
    };
  },
  watch: {
    checkedKeys(val) {
      console.log("onCheck", val);
    }
  },

  mounted: function() {
    this.queryAdminInfo();
    this.queryCopyright();
    this.queryCooperation();
    this.queryAddStyle();
  },
  methods: {
    //编辑版权
    toEdit(val) {
      console.log(val);
      this.editCopyright = true;
      this.editCopyrightTextOld = val.name;
      this.editCopyrightText = val.name;
    },
    //取消版权
    handleOkEditCopyright() {
      //新增版权
      const param = {
        key: localStorage.getItem("admin"),
        operation: 2,
        name: this.editCopyrightText,
        update: this.editCopyrightTextOld
      }; // 获取所有
      apiCopyright(param).then(res => {
        console.log(res);
        if (res.state == 0) {
          this.queryCopyright();
          this.$message.success("编辑成功！");
          this.editCopyright = false;
        } else {
          this.$message.error("编辑失败！");
        }
      });
    },
    handleCancelEditCopyright() {
      this.editCopyright = false;
    },
    //编辑版权
    toEditCooperation(val) {
      console.log(val);
      this.editCooperation = true;
      this.editCooperationTextOld = val.name;
      this.editCooperationText = val.name;
    },
       //编辑风格
    toEditStyle(val) {
      console.log(val);
      this.editStyle = true;
      this.editStyleTextOld = val.name;
      this.editStyleText = val.name;
    },
     handleOkEditStyle() {
      //新增版权
      const param = {
        key: localStorage.getItem("admin"),
        operation: 2,
        name: this.editStyleText,
        update: this.editStyleTextOld
      }; // 获取所有
      apiSongStyle(param).then(res => {
        console.log(res);
        if (res.state == 0) {
          this.queryAddStyle();
          this.$message.success("编辑成功！");
          this.editStyle = false;
        } else {
          this.$message.error("编辑失败！");
        }
      });
    },
        //取消版权编辑
    handleCancelEditStyle() {
      this.editStyle = false;
    },
    
    handleOkEditCooperation() {
      //新增版权
      const param = {
        key: localStorage.getItem("admin"),
        operation: 2,
        name: this.editCooperationText,
        update: this.editCooperationTextOld
      }; // 获取所有
      apiCooperation(param).then(res => {
        console.log(res);
        if (res.state == 0) {
          this.queryCooperation();
          this.$message.success("编辑成功！");
          this.editCooperation = false;
        } else {
          this.$message.error("编辑失败！");
        }
      });
    },
        //取消版权编辑
    handleCancelEditCooperation() {
      this.editCooperation = false;
    },

    //取消版权方式弹窗

    handleOkCopyright() {
      this.visibleCopyright = false;
    },
    //确认风格弹窗
    handleOkAddstyle() {
      this.visibleStyle = false;
    },
    handleAddstyle() {
      this.visibleStyle = false;
    },
    //取消风格弹窗
    handleCancelAddstyle() {
      this.visibleStyle = false;
    },
    //取消版权方式弹窗
    handleCancelCopyright() {
      this.visibleCopyright = false;
    },
    //新增版权方式弹窗
    addvisibleCopyright() {
      this.visibleCopyright = true;
    },
    //取消版权方式弹窗
    handleOkCooperation() {
      this.visibleCooperation = false;
    },
    //取消版权方式弹窗
    handleCancelCooperation() {
      this.visibleCooperation = false;
    },
    //新增版权方式弹窗
    addvisibleCooperation() {
      this.visibleCopyright = true;
    },
    //新增歌曲风格
    addvisibleStyle() {
      this.visibleStyle = true;
    },

    addvisibleCooperation() {
      this.visibleCooperation = true;
    },
    //确认删除版权方式
    confirmCopyright(val) {
      console.log(val);
      //新增版权
      const param = {
        key: localStorage.getItem("admin"),
        operation: -1,
        name: val.name
      }; // 获取所有
      apiCopyright(param).then(res => {
        console.log(res);
        if (res.state == 0) {
          this.queryCopyright();
        }
      });
    },
    cancelCopyright() {},
    cancelCooperation() {},
    //取消删除歌曲风格
    cancelAddstyle(val) {},

    //确认删除歌曲风格
    confirmAddstyle(val) {
      console.log(val);
      //新增版权
      const param = {
        key: localStorage.getItem("admin"),
        operation: -1,
        name: val.name
      }; // 获取所有
      apiSongStyle(param).then(res => {
        console.log(res);
        if (res.state == 0) {
          this.queryAddStyle();
        }
      });
    },
    confirmCooperation(val) {
      console.log(val);
      //新增版权
      const param = {
        key: localStorage.getItem("admin"),
        operation: -1,
        name: val.name
      }; // 获取所有
      apiCooperation(param).then(res => {
        console.log(res);
        if (res.state == 0) {
          this.queryCooperation();
        }
      });
    },

    //新增版权
    addCopyright() {
      const param = {
        key: localStorage.getItem("admin"),
        operation: 1,
        name: this.copyrightText
      }; // 获取所有
      apiCopyright(param).then(res => {
        console.log(res);
        if (res.state == 0) {
          this.$message.success("新增成功！");

          this.queryCopyright();
        } else {
          this.$message.error("新增失败！");
        }
      });
    },

    //新增歌曲风格
    addStyle() {
      const param = {
        key: localStorage.getItem("admin"),
        operation: 1,
        name: this.songStyle
      }; // 获取所有
      apiSongStyle(param).then(res => {
        console.log(res);
        if (res.state == 0) {
          this.$message.success("新增成功！");

          this.queryAddStyle();
        } else {
          this.$message.error("新增失败！");
        }
      });
    },
    //新增合作方式
    addCooperation() {
      const param = {
        key: localStorage.getItem("admin"),
        operation: 1,
        name: this.cooperationText
      }; // 获取所有
      apiCooperation(param).then(res => {
        console.log(res);
        if (res.state == 0) {
          this.$message.success("新增成功！");

          this.queryCooperation();
        } else {
          this.$message.error("新增失败！");
        }
      });
    },
    //获取版权方式
    queryCopyright() {
      const param = {
        key: localStorage.getItem("admin"),
        operation: 0,
        name: ""
      }; // 获取所有
      apiCopyright(param).then(res => {
        console.log(res);
        if (res.state == 0) {
          this.data1 = [];

          res.data.map((item, index) => {
            let obj = {
              name: item,
              keys: index
            };
            this.data1.push(obj);
          });
        }
      });
    },
    //获取合作方式
    queryCooperation() {
      const param = {
        key: localStorage.getItem("admin"),
        operation: 0,
        name: ""
      }; // 获取所有
      apiCooperation(param).then(res => {
        console.log(res);
        if (res.state == 0) {
          this.data2 = [];

          res.data.map((item, index) => {
            let obj = {
              name: item,
              keys: index
            };
            this.data2.push(obj);
          });
        }
      });
    },
    //获取合作方式
    queryAddStyle() {
      const param = {
        key: localStorage.getItem("admin"),
        operation: 0,
        name: ""
      }; // 获取所有
      apiSongStyle(param).then(res => {
        console.log(res);
        if (res.state == 0) {
          this.data3 = [];

          res.data.map((item, index) => {
            let obj = {
              name: item,
              keys: index
            };
            this.data3.push(obj);
          });
        }
      });
    },

    //查询账户列表
    queryAdminInfo() {
      const param = { key: localStorage.getItem("admin") };
      apiUserList(param).then(res => {
        console.log(res);
        if (res.state == 0) {
          res.funcGroup.map((item, index) => {
            item.key = index;
            //this.data[index].userName=item.userName
            // this.data[index].key=index
          });
          this.data = res.funcGroup;
          this.data = [...this.data];
          console.log(this.data);
          // this.$router.push("/Authority/Group");
        } else {
          this.$message.error("密码错误，请从新登陆！");
        }
      });
    },
    //新增
    addAdmin() {
      this.visible = true;
      this.disabledType = false;
      this.passwordType = true;
      this.titleType = "新增";
      this.form.resetFields();

      console.log(this.form);
    },
    //打开编辑
    onEdit(item) {
      this.visible = true;
      this.passwordType = false;
      this.titleType = "编辑";
      this.disabledType = true;

      console.log(item);
      this.form.resetFields();
      this.$nextTick(() => {
        this.form.setFieldsValue({
          userName: item.userName,
          nName: item.nName,
          telephone: item.telephone,
          weiXin: item.weiXin,
          password: item.password
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
        console.log(res);
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
      console.log(e);
      this.$message.error("Click on No");
    },
    //保存
    handleSubmit(e) {
      e.preventDefault();

      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.titleType === "新增") {
            const param = {
              userName: values.userName,
              password: values.password,
              nName: values.nName,
              telephone: values.telephone,
              weiXin: values.weiXin
            };
            apiRegistered(param).then(res => {
              console.log(res);
              if (res.state == 0) {
                this.visible = false;
                this.$message.success("注册成功！");
                this.queryAdminInfo();
              } else {
                this.$message.error("注册失败，请重新注册");
              }
            });
          } else {
            const param = {
              key: localStorage.getItem("admin"),
              userName: values.userName,
              item: {
                password: values.password,
                nName: values.nName,
                telephone: values.telephone,
                weiXin: values.weiXin
              }
            };
            apiEditList(param).then(res => {
              console.log(res);
              if (res.state == 0) {
                this.visible = false;
                this.$message.success("编辑成功！");
                this.queryAdminInfo();
              } else {
                this.$message.error("编辑失败，请重新编辑");
              }
            });
          }
        }
      });
    },
    //编辑
    handleSubmitEdit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
        }
      });
    },
    handleSelectChange(value) {
      console.log(value);
      this.form.setFieldsValue({
        note: `Hi, ${value === "male" ? "man" : "lady"}!`
      });
    },
    handleOk(e) {
      this.handleSubmit(e);
    },
    handleCancel(e) {
      console.log("Clicked cancel button");
      this.visible = false;
    },
    handleOkEdit(e) {
      this.visibleEdit = false;
      // this.ModalText = "The modal will be closed after two seconds";
      // this.confirmLoading = true;
      // setTimeout(() => {

      //   this.confirmLoading = false;
      // }, 2000);
    },
    handleCancelEdit(e) {
      console.log("Clicked cancel button");
      this.visibleEdit = false;
    },
    handleOkTree(e) {
      console.log(this.checkedKeys);
      let tempArr = [];
      this.checkedKeys.filter(item => {
        tempArr.push(parseInt(item));
      });
      console.log(tempArr);
      const param = {
        key: localStorage.getItem("admin"),
        userName: this.authorizationId,
        action: 1,
        funcGroup: tempArr
      };
      apiAuthorizationList(param).then(res => {
        console.log(res);
        if (res.state == 0) {
          this.visible = false;
          this.$message.success("授权成功！");
          this.queryAdminInfo();
        } else {
          this.$message.error("授权失败，请重新授权");
        }
      });

      // this.ModalText = "The modal will be closed after two seconds";
      // this.confirmLoadng = true;
      this.visibleAuthorization = false;
    },
    handleCancel1(e) {
      console.log("Clicked cancel button");
      this.visibleAuthorization = false;
    },
    onExpand(expandedKeys) {
      // console.log("onExpand", expandedKeys);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys) {
      //console.log("onCheck", checkedKeys);
      this.checkedKeys = checkedKeys;
    },
    onSelect(selectedKeys, info) {
      console.log("onSelect", info);
      this.selectedKeys = selectedKeys;
    },
    onAuthorization(item) {
      this.checkedKeys = [];
      console.log(item);
      const param = {
        key: localStorage.getItem("admin"),
        userName: item.userName
      };
      apiUserNameList(param).then(res => {
        console.log(res);
        if (res.state == 0) {
          this.checkedKeys = res.data.funcGroup;
         
        } else {
          // this.$message.error("密码错误，请从新登陆！");
        }
      });
      //queryAdminInfo()
      this.authorizationId = item.userName;
      this.visibleAuthorization = true;
    }
  }
};
</script>

<style>
</style>