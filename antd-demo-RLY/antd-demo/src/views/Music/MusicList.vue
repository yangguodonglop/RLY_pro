<template>
  <div>
    <a-row>
      <a-col :span="24" style="display: flex;
    justify-content: start;
    align-items: center;">
        <a-button type="primary" @click="loadSong()">上传小样</a-button>
        <a-button type="primary" @click="loadSongCp()" style="margin-left:20px">上传成品</a-button>

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
        <a-button type="primary" style="margin-left:20px;" @click="resetInfo()">重置</a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-table
          :pagination="false"
          :columns="columns"
          :bordered="true"
          :data-source="data"
          style="margin-top:20px"
        >
          <span slot="status3" slot-scope="record" style="display: flex; justify-content: flex-start;align-items: center;">
            <div>{{record.cr_songName}}</div>

            <a-button
              type="primary"
              size="small"
              style="margin-left:5px"
              @click="addRemark(record)"
            >备注</a-button>
            <a-button
              v-if="record.remark!==''"
              type="primary"
              size="small"
              style="margin-left:5px"
              @click="checkRemark(record)"
            >查看</a-button>
          </span>
          <span slot="status" slot-scope="record">
            <div style="color:#14e699;display: flex;">
              <div
                v-if="record.state==6"
                style="color:#14e699;align-items: center;width:50px; padding: 5px;background: rgb(79 169 232); border-radius: 10px;color: #ffffff; text-align: center;"
              >提交</div>

              <div
                v-if="record.state==7"
                style="color:#14e699;align-items: center;width:50px; padding: 5px;background: rgb(220 135 29); border-radius: 10px;color: #ffffff; text-align: center;"
              >驳回</div>
              <div
                v-if="record.state==8"
                style="color:#14e699;align-items: center;width:50px; padding: 5px;background:rgb(41 232 73); border-radius: 10px;color: #ffffff; text-align: center;"
              >通过</div>
              <div
                v-if="record.state>8"
                style="color:#14e699;align-items: center;width:50px; padding: 5px;background:rgb(41 232 73); border-radius: 10px;color: #ffffff; text-align: center;"
              >通过</div>
              <div
                v-if="record.ar_account!==''"
                style="color:rgb(146 150 149);display: flex; align-items: center;margin-left:10px"
              >{{record.ar_account}}</div>
              <div
                v-if="record.state==7"
                style="color:rgb(146 150 149);display: flex; align-items: center;margin-left:10px"
              >
                <a-button type="primary" @click="queryRefuseInfo(record,'BQBH')">查看</a-button>
              </div>
              <a-popover
                title="查看时间"
                style="margin-left:5px"
                v-if="record.ar_taskCT!=='暂未开始' || record.ar_taskOT!=='暂未完成'"
              >
                <template slot="content">
                  <p>开始时间:{{record.ar_taskCT}}</p>
                  <p>结束时间:{{record.ar_taskOT}}</p>
                </template>
                <a-button type="primary">查看时间</a-button>
              </a-popover>
            </div>
          </span>
          <span slot="status1" slot-scope="record">
            <div style="color:#14e699;display: flex;">
              <div
                v-if="record.state==11"
                style="color:#14e699;align-items: center;width:50px; padding: 5px;background: rgb(79 169 232); border-radius: 10px;color: #ffffff; text-align: center;"
              >提交</div>
              <div
                v-if="record.state==12"
                style="color:#14e699;align-items: center;width:50px; padding: 5px;background: rgb(220 135 29); border-radius: 10px;color: #ffffff; text-align: center;"
              >驳回</div>
              <div
                v-if="record.state==13"
                style="color:#14e699;align-items: center;width:50px; padding: 5px;background:rgb(41 232 73); border-radius: 10px;color: #ffffff; text-align: center;"
              >通过</div>
              <div
                v-if="record.state>13"
                style="color:#14e699;align-items: center;width:50px; padding: 5px;background:rgb(41 232 73); border-radius: 10px;color: #ffffff; text-align: center;"
              >通过</div>
              <div
                v-if="record.rec_account!==''"
                style="color:rgb(146 150 149);display: flex; align-items: center;margin-left:10px"
              >{{record.rec_account}}</div>
              <div
                v-if="record.state==12"
                style="color:rgb(146 150 149);display: flex; align-items: center;margin-left:10px"
              >
                <a-button type="primary" @click="queryRefuseInfo(record,'LYBH')">查看</a-button>
              </div>
              <a-popover
                title="查看时间"
                style="margin-left:5px"
                v-if="record.rec_taskCT!=='暂未开始' || record.rec_taskOT!=='暂未完成'"
              >
                <template slot="content">
                  <p>开始时间:{{record.rec_taskCT}}</p>
                  <p>结束时间:{{record.rec_taskOT}}</p>
                </template>
                <a-button type="primary">查看时间</a-button>
              </a-popover>
            </div>
          </span>
          <span slot="status2" slot-scope="record">
            <div style="color:#14e699;display: flex;">
              <div
                v-if="record.state==16"
                style="color:#14e699;align-items: center;width:50px; padding: 5px;background: rgb(79 169 232); border-radius: 10px;color: #ffffff; text-align: center;"
              >提交</div>

              <div
                v-if="record.state==17"
                style="color:#14e699;align-items: center;width:50px; padding: 5px;background:  rgb(220 135 29); border-radius: 10px;color: #ffffff; text-align: center;"
              >驳回</div>
              <div
                v-if="record.state==18"
                style="color:#14e699;align-items: center;width:50px; padding: 5px;background:rgb(41 232 73); border-radius: 10px;color: #ffffff; text-align: center;"
              >通过</div>
              <div
                v-if="record.state>18"
                style="color:#14e699;align-items: center;width:50px; padding: 5px;background:rgb(41 232 73)); border-radius: 10px;color: #ffffff; text-align: center;"
              >通过</div>
              <div
                v-if="record.mix_account!==''"
                style="color:rgb(146 150 149);display: flex; align-items: center;margin-left:10px"
              >{{record.mix_account}}</div>

              <div
                v-if="record.state==17"
                style="color:rgb(146 150 149);display: flex; align-items: center;margin-left:10px"
              >
                <a-button type="primary" @click="queryRefuseInfo(record,'HYBH')">查看</a-button>
              </div>
              <a-popover
                title="查看时间"
                style="margin-left:5px"
                v-if="record.mix_taskCT!=='暂未开始' || record.mix_taskOT!=='暂未完成'"
              >
                <template slot="content">
                  <p>开始时间:{{record.mix_taskCT}}</p>
                  <p>结束时间:{{record.mix_taskOT}}</p>
                </template>
                <a-button type="primary">查看时间</a-button>
              </a-popover>
            </div>
          </span>
          <span slot="action" slot-scope="record">
            <a-dropdown>
              <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                操作
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <!-- <a-menu-item>
                  <a href="javascript:;" @click="loadSong(record)">上传小样</a>
                </a-menu-item>-->
                <a-menu-item>
                  <a href="javascript:;" @click="tryAudition(record)">选择试听</a>
                </a-menu-item>

                <a-menu-item v-if="producerHideMain">
                  <a href="javascript:;" @click="toProducer(record,'Producer')">分配制作人</a>
                </a-menu-item>
                <a-menu-item v-if="producerHide">
                  <a href="javascript:;" @click="toProducer(record,'ArrangementM')">分配编曲组长</a>
                </a-menu-item>
                <a-menu-item v-if="producerHide">
                  <a href="javascript:;" @click="toProducer(record,'RecorderM')">分配录音组长</a>
                </a-menu-item>
                <a-menu-item v-if="producerHide">
                  <a href="javascript:;" @click="toProducer(record,'MixerM')">分配缩混组长</a>
                </a-menu-item>
                <a-menu-item v-if="arrangementHideM">
                  <a href="javascript:;" @click="toProducer(record,'Arrangement')">分配编曲师</a>
                </a-menu-item>
                <a-menu-item v-if="recorderHideM">
                  <a href="javascript:;" @click="toProducer(record,'Recorder')">分配录音师</a>
                </a-menu-item>
                <a-menu-item v-if="mixerHideM">
                  <a href="javascript:;" @click="toProducer(record,'Mixer')">分配混音师</a>
                </a-menu-item>
                <a-menu-item v-if="arrangementHide">
                  <a href="javascript:;" @click="toLoadArrangement(record,'Arrangement')">上传编曲</a>
                </a-menu-item>
                <a-menu-item v-if="recorderHide">
                  <a href="javascript:;" @click="toLoadRecord(record,'Arrangement')">上传录音</a>
                </a-menu-item>
                <a-menu-item v-if="mixerHide">
                  <a href="javascript:;" @click="toLoadMix(record,'Mix')">上传缩混</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="uploadActive(record,'XZXY')">下载小样文件</a>
                </a-menu-item>
                <a-menu-item v-if="lyricsZzHide">
                  <a href="javascript:;" @click="updateLyric(record,'BQGC')">重新上传歌词</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="uploadActive(record,'BQXY')">下载编曲小样文件</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="uploadActive(record,'BQGC')">下载编曲工程文件</a>
                </a-menu-item>
                <!-- <a-menu-item>
                  <a href="javascript:;" @click="uploadActive11(record,'BQGC')">下载编曲工程文件测试</a>
                </a-menu-item>-->

                <a-menu-item>
                  <a href="javascript:;" @click="uploadActive(record,'LYXY')">下载录音小样文件</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="uploadActive(record,'DCXY')">下载导唱文件</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="uploadActive(record,'LYGC')">下载录音工程文件</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="uploadActive(record,'HYXY')">下载混音小样文件</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="uploadActive(record,'HYGC')">下载混音工程文件</a>
                </a-menu-item>
                <a-menu-item v-if="producerHide">
                  <a href="javascript:;" @click="toPass(record)">通过</a>
                </a-menu-item>
                <a-menu-item v-if="producerHide">
                  <a href="javascript:;" @click="toBack(record)">驳回</a>
                </a-menu-item>
                <a-menu-item v-if="producerHide">
                  <a href="javascript:;" @click="deleteSong(record)">删除</a>
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
              :bordered="true"
              :data-source="data1"
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
      :title="titleType"
      :visible="visibleSong"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="确定"
      cancelText="取消"
      :ok-button-props="{ props: { disabled: disabledActive } }"
    >
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        @submit="handleSubmit"
      >
        <a-form-item label="歌曲名称">
          <a-input
            v-decorator="[
              'songName',
              { rules: [{ required: true, message: '请输入歌曲名称!' }] },
            ]"
          />
        </a-form-item>

        <a-form-item label="作词者">
          <a-input
            v-decorator="[
              'librettist',
              { rules: [{ required: true, message: '请输入作词者!' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="作曲者">
          <a-input
            v-decorator="[
              'composer',
              { rules: [{ required: true, message: '请输入作曲者!' }] },
            ]"
          />
        </a-form-item>

        <a-form-item label="歌曲风格">
          <a-select
            style="width: 100%"
            mode="tags"
            @change="handleChangeClient"
            v-decorator="[
              'tags',
              { rules: [{ required: true, message: '请选择歌曲风格!' }] },
            ]"
          >
            <template v-for="(item,index) in styleList">
              <a-select-option :value="item" v-bind:key="index">{{item}}</a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item label="歌曲上传">
          <a-upload
            :file-list="fileList"
            :remove="handleRemove"
            :before-upload="beforeUpload"
            v-decorator="[
              'mixCodes',
              { rules: [{ required: true, message: '请上传歌曲!' }] },
            ]"
          >
            <a-button>
              <a-icon type="upload" />点击上传
            </a-button>
          </a-upload>
          <a-button
            type="primary"
            :disabled="fileList.length === 0"
            :loading="uploading"
            style="margin-top: 16px"
            @click="handleUpload"
          >{{ uploading ? '上传中' : '开始上传' }}</a-button>
        </a-form-item>

        <a-form-item label="歌词上传">
          <a-upload
            :file-list="fileList1"
            :remove="handleRemove1"
            :before-upload="beforeUpload1"
            v-decorator="[
              'auditionCodes',
              { rules: [{ required: true, message: '请输入歌词!' }] },
            ]"
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
      :title="titleType"
      :visible="visibleSongCp"
      @ok="handleOkCp"
      @cancel="handleCancelCp"
      okText="确定"
      cancelText="取消"
      :ok-button-props="{ props: { disabled: disabledActive } }"
    >
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        @submit="handleSubmitCp"
      >
        <a-form-item label="歌曲名称">
          <a-input
            v-decorator="[
              'songName',
              { rules: [{ required: true, message: '请输入歌曲名称!' }] },
            ]"
          />
        </a-form-item>

        <a-form-item label="作词者">
          <a-input
            v-decorator="[
              'librettist',
              { rules: [{ required: true, message: '请输入作词者!' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="作曲者">
          <a-input
            v-decorator="[
              'composer',
              { rules: [{ required: true, message: '请输入作曲者!' }] },
            ]"
          />
        </a-form-item>

        <a-form-item label="歌曲风格">
          <a-select
            style="width: 100%"
            mode="tags"
            @change="handleChangeClient"
            v-decorator="[
              'tags',
              { rules: [{ required: true, message: '请选择歌曲风格!' }] },
            ]"
          >
            <template v-for="(item,index) in styleList">
              <a-select-option :value="item" v-bind:key="index">{{item}}</a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item label="歌曲上传">
          <a-upload
            :file-list="fileList"
            :remove="handleRemove"
            :before-upload="beforeUpload"
            v-decorator="[
              'mixCodes',
              { rules: [{ required: true, message: '请上传歌曲!' }] },
            ]"
          >
            <a-button>
              <a-icon type="upload" />点击上传
            </a-button>
          </a-upload>
          <a-button
            type="primary"
            :disabled="fileList.length === 0"
            :loading="uploading"
            style="margin-top: 16px"
            @click="handleUpload"
          >{{ uploading ? '上传中' : '开始上传' }}</a-button>
        </a-form-item>

        <a-form-item label="歌词上传">
          <a-upload
            :file-list="fileList1"
            :remove="handleRemove1"
            :before-upload="beforeUpload1"
            v-decorator="[
              'auditionCodes',
              { rules: [{ required: true, message: '请输入歌词!' }] },
            ]"
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
      :title="titleActive"
      :visible="visibleProducer"
      @ok="handleOkProducer"
      @cancel="handleCancelProducer"
      okText="确定"
      cancelText="取消"
    >
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        @submit="handleSubmit2"
      >
        <a-form-item :label="titleActive">
          <a-select style="width: 100%" @change="handleChangeClient1">
            <template v-for="(item,index) in userList">
              <a-select-option :value="item.account" v-bind:key="index">{{item.name}}</a-select-option>
            </template>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      :title="titleTypeActive"
      :visible="visibleSongLoad"
      @ok="handleOkLoad"
      @cancel="handleCancelLoad"
      okText="确定"
      cancelText="取消"
      :ok-button-props="{ props: { disabled: disabledActive3 } }"
    >
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        @submit="handleSubmit3"
      >
        <a-form-item label="歌曲名">
          <a-input :disabled="true" v-model="songName" />
        </a-form-item>

        <a-form-item :label="titleTypeActive">
          <a-upload :file-list="fileList2" :remove="handleRemove2" :before-upload="beforeUpload2">
            <a-button>
              <a-icon type="upload" />点击上传
            </a-button>
          </a-upload>
          <a-button
            type="primary"
            :disabled="fileList2.length === 0"
            :loading="uploading2"
            style="margin-top: 16px"
            @click="handleUpload2"
          >{{ uploading2? '上传中' : '开始上传' }}</a-button>
        </a-form-item>
        <a-form-item :label="titleTypeActivess">
          <a-upload :file-list="fileList3" :remove="handleRemove3" :before-upload="beforeUpload3">
            <a-button>
              <a-icon type="upload" />点击上传
            </a-button>
          </a-upload>
          <a-button
            type="primary"
            :disabled="fileList3.length === 0"
            :loading="uploading3"
            style="margin-top: 16px"
            @click="handleUpload3"
          >{{ uploading3? '上传中' : '开始上传' }}</a-button>
        </a-form-item>
        <a-form-item label="上传导唱文件" v-if="ArrangementDaoChangFileCodeTab">
          <a-upload :file-list="fileList5" :remove="handleRemove5" :before-upload="beforeUpload5">
            <a-button>
              <a-icon type="upload" />点击上传
            </a-button>
          </a-upload>
          <a-button
            type="primary"
            :disabled="fileList5.length === 0"
            :loading="uploading5"
            style="margin-top: 16px"
            @click="handleUpload5"
          >{{ uploading5? '上传中' : '开始上传' }}</a-button>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      title="重新上传歌词"
      :visible="visibleUpdateLyric"
      @ok="handleOkUpdateLyric"
      @cancel="handleUpdateLyric"
      okText="确定"
      cancelText="取消"
      :ok-button-props="{ props: { disabled: disabledActive44 } }"
    >
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        @submit="handleSubmit4"
      >
        <a-form-item label="歌曲名">
          <a-input :disabled="true" v-model="songName" />
        </a-form-item>

        <a-form-item label="上传歌词">
          <a-upload :file-list="fileList4" :remove="handleRemove4" :before-upload="beforeUpload4">
            <a-button>
              <a-icon type="upload" />点击上传
            </a-button>
          </a-upload>
          <a-button
            type="primary"
            :disabled="fileList4.length === 0"
            :loading="uploading4"
            style="margin-top: 16px"
            @click="handleUpload4"
          >{{ uploading4? '上传中' : '开始上传' }}</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      title="驳回意见"
      :visible="visibleRefuse"
      @ok="handleOkRefuse"
      @cancel="handleCancelRefuse"
      okText="确定"
      cancelText="取消"
    >
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        @submit="handleSubmit2"
      >
        <textarea class="textarea-con" v-model="refuseText" placeholder="请输入驳回意见"></textarea>
      </a-form>
    </a-modal>
    <a-modal
      title="驳回意见"
      :visible="visibleRefuseCheck"
      @ok="handleOkRefuseCheck"
      @cancel="handleCancelRefuseCheck"
      :footer="null"
      okText="确定"
      cancelText="取消"
    >
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        @submit="handleSubmit2"
      >
        <textarea class="textarea-con" v-model="refuseText" placeholder="请输入驳回意见"></textarea>
      </a-form>
    </a-modal>
    <a-modal
      title="添加备注"
      :visible="visibleRemark"
      @ok="handleOkRemark"
      @cancel="handleCancelRemark"
      okText="确定"
      cancelText="取消"
    >
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        @submit="handleSubmit22"
      >
        <div v-html="remarkTextActive" v-if="remarkStatus"></div>
        <textarea
          class="textarea-con"
          v-if="!remarkStatus"
          v-model="remarkText"
          placeholder="请输入歌曲备注"
        ></textarea>
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
    key: "cr_songName",
    scopedSlots: { customRender: "status3" }
  },
  {
    title: "歌曲风格",
    key: "cr_tag",
    dataIndex: "cr_tag",
    scopedSlots: { customRender: "tags" }
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
  {
    title: "制作人",
    key: "producer",
    dataIndex: "producer",
    scopedSlots: { customRender: "tags" }
  },

  {
    title: "编曲状态",
    key: "status",
    scopedSlots: { customRender: "status" }
  },
  {
    title: "录音状态",
    key: "status1",
    scopedSlots: { customRender: "status1" }
  },
  {
    title: "缩混状态",
    key: "status2",
    scopedSlots: { customRender: "status2" }
  },
  // {
  //   title: "发布时间",
  //   key: "createTime",
  //   dataIndex: "createTime",
  //   scopedSlots: { customRender: "tags" }
  // },
  // {
  //   title: "结束时间",
  //   key: "updateTime",
  //   dataIndex: "updateTime",
  //   scopedSlots: { customRender: "tags" }
  // },

  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

const data = [];
const data1 = [];
import axios from "axios";
import {
  apiUserList,
  apiRegistered,
  apiDeleteList,
  apiEditList,
  apiAuthorizationList,
  apiUserNameList,
  apigetSongInfo,
  baseUrl,
  baseUrlActive,
  apiQueryAuditionState,
  apiGetSongLyric,
  apiGetLyricContent,
  apiUploadComplete,
  apiUploadLyric,
  apiUploadCommitMix,
  apiSongStyle,
  apiDeleteSong,
  apiCopyright,
  apiCooperation,
  apiGetWorker,
  apiAllocatingTask,
  apiCheckWork,
  apiCommitDemo,
  apiCommitArrangement,
  apiCommitRecord,
  apiCommitMix,
  apidownLoad,
  apiUploadProjectFile,
  apiUpdateLyric,
  apiAddRemark,
  apiUploadNew,
  apiGetSongwriter
} from "@/request/api"; // 导入我们的api接口
import common from "@/request/util";

export default {
  data() {
    return {
      data,
      columns,
      columnPartner,
      data1,
      ModalText: "Content of the modal",
      visible: false,
      visibleSong: false,
      visibleSongLoad: false,
      visibleEdit: false,
      confirmLoading: false,
      disabledActive: true,
      disabledActive1: false,
      disabledActive2: false,
      disabledActive11: false,
      disabledActive22: false,
      disabledActive44: true,
      disabledActive3: true,

      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      visibleAuthorization: false,
      text: "9999",
      passwordType: true,
      titleType: "新增",
      titleTypeActive: "上传编曲",
      titleTypeActivess: "上传工程文件",
      authorizationId: "",
      current: 1,
      totalNum: 0,
      visibleAudition: false,
      auditionCodeUrl: "",
      current1: 1,
      totalNum1: 0,
      visiblePartner: false,
      mixCode: "",
      auditionCode: "",
      lyricCode: "",
      fileList: [],
      uploading: false,
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileList4: [],
      fileList5: [],
      uploading1: false,
      uploading2: false,
      uploading3: false,
      uploading4: false,
      uploading5: false,

      songText: "",
      songName: "",
      songNameActive: "",
      stateValue: "",
      librettist: "",
      composer: "",
      startTime: 0,
      endTime: 0,
      styleList: [],
      client: "",
      createValue: [],
      styleValue: undefined,
      styleList: [],
      lyricistActive: "",
      composerActive: "",
      visibleType: true,
      queryCopyList: [],
      cooperationList: [],
      visibleProducer: false,
      ProducerId: "",
      songID: 0,
      titleActive: "",
      userList: [],
      chooseType: "",
      ArrangementLoadCode: "",
      projectCode: "",
      ArrangementDaoChangFileCode: "",
      ArrangementDaoChangFileCodeTab: true,
      uploadType: "",
      producerHide: false,
      producerHideMain: false,
      arrangementHide: false,
      recorderHide: false,
      mixerHide: false,
      arrangementHideM: false,
      lyricsZzHide: false,
      recorderHideM: false,
      mixerHideM: false,
      visibleRefuse: false,
      refuseText: "",
      remarkText: "",
      remarkSongname: "",
      refusetampStep: "",
      refusesongName: "",
      visibleRefuseCheck: false,
      visibleUpdateLyric: false,
      visibleRemark: false,
      remarkInfo: "asdsadasd",
      remarkStatus: false,
      remarkTextActive: "",
      visibleSongCp: false,

      funcGroupArr: []

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
    this.queryStyle();
    this.querySongwriter()
    this.funcGroupArr = localStorage.getItem("funcGroup").split(",");

    if (
      this.funcGroupArr.includes("101") == true ||
      this.funcGroupArr.includes("100") == true
    ) {
      this.producerHideMain = true;
    }
    if (
      this.funcGroupArr.includes("102") == true ||
      this.funcGroupArr.includes("100") == true
    ) {
      this.producerHide = true;
    }
    if (
      this.funcGroupArr.includes("104") == true ||
      this.funcGroupArr.includes("100") == true
    ) {
      this.arrangementHideM = true;
    }
    if (
      this.funcGroupArr.includes("103") == true ||
      this.funcGroupArr.includes("100") == true
    ) {
      this.lyricsZzHide = true;
    }
    if (
      this.funcGroupArr.includes("106") == true ||
      this.funcGroupArr.includes("100") == true
    ) {
      this.recorderHideM = true;
    }
    if (
      this.funcGroupArr.includes("108") == true ||
      this.funcGroupArr.includes("100") == true
    ) {
      this.mixerHideM = true;
    }
    if (
      this.funcGroupArr.includes("105") == true ||
      this.funcGroupArr.includes("100") == true
    ) {
      this.arrangementHide = true;
    }
    if (
      this.funcGroupArr.includes("107") == true ||
      this.funcGroupArr.includes("100") == true
    ) {
      this.recorderHide = true;
    }
    if (
      this.funcGroupArr.includes("109") == true ||
      this.funcGroupArr.includes("100") == true
    ) {
      this.mixerHide = true;
    }

    // this.queryCopyright()
    // this.queryCooperation()
  },
  methods: {
    //弹出备注
    addRemark(val) {
      this.remarkText = "";
      this.remarkSongname = val.cr_songName;
      this.visibleRemark = true;
      this.remarkStatus = false;
    },
    checkRemark(val) {
      this.remarkTextActive = val.remark;
      this.visibleRemark = true;
      this.remarkStatus = true;
    },

    //取消备注
    handleCancelRemark() {
      this.visibleRemark = false;
    },
    //确认备注
    handleOkRemark(e) {
      e.preventDefault();
      this.handleSubmit22(e);

      this.visibleRemark = false;
    },
    handleSubmit22() {
      const param = {
        key: localStorage.getItem("admin"),
        song: this.remarkSongname,
        remark: this.remarkText + "</br>"
      };
      apiAddRemark(param).then(res => {
        console.log(res);
        if (res.state == 0) {
          this.$message.success("备注成功！");
          this.querySongInfo();
        } else {
          this.$message.error("备注失败");
          this.querySongInfo();
        }
      });
    },
    //上传歌词
    updateLyric(val) {
      this.visibleUpdateLyric = true;
      this.disabledActive44 = true;

      this.songName = val.cr_songName;
    },
    handleUpdateLyric() {
      this.visibleUpdateLyric = false;
    },
    handleOkUpdateLyric(e) {
      this.handleSubmit4(e);
    },
    //查看
    queryRefuseInfo(val, typeActive) {
      this.refuseText = "";
      switch (typeActive) {
        case "BQBH":
          this.refuseText = val.ar_remark;
          break;
        case "LYBH":
          this.refuseText = val.rec_remark;
          break;
        case "HYBH":
          this.refuseText = val.mix_remark;
          break;
      }

      this.visibleRefuseCheck = true;
    },

    //取消查看
    handleOkRefuseCheck() {
      this.visibleRefuseCheck = false;
    },
    handleCancelRefuseCheck() {
      this.visibleRefuseCheck = false;
    },

    //确定驳回
    handleOkRefuse() {
      let param = {
        key: localStorage.getItem("admin"),
        songName: this.refusesongName,
        step: this.refusetampStep,
        operation: "refuse",
        remark: this.refuseText
      };

      apiCheckWork(param).then(res => {
        if (res.state == 0) {
          this.$message.success("审核驳回操作成功！");
          this.querySongInfo();
          this.visibleRefuse = false;
        } else {
          this.$message.error("审核驳回操作失败！");
          this.querySongInfo();
          this.visibleRefuse = false;
        }
        console.log(res);
      });
    },
    //取消驳回
    handleCancelRefuse() {
      this.visibleRefuse = false;
    },
    //下载文件
    uploadActive(val, typess) {
      let type = "";
      switch (typess) {
        case "BQXY":
          type = val.ar_file;
          break;
        case "BQGC":
          type = val.ar_projectFile;
          break;
        case "LYXY":
          type = val.rec_file;
          break;
        case "LYGC":
          type = val.rec_projectFile;
          break;
        case "HYXY":
          type = val.mix_auditionFile;
          break;
        case "HYGC":
          type = val.mix_projectFile;
          break;
        case "XZXY":
          type = val.cr_demoFile;
          break;
        case "DCXY":
          type = val.daoChangFile;
          break;
      }
      if (type === "") {
        this.$message.error("该文件为空，不可下载！");
        return false;
      }
      if (
        typess === "BQXY" ||
        typess === "LYXY" ||
        typess === "HYXY" ||
        typess === "XZXY" ||
        typess === "DCXY"
      ) {
        const param = {
          key: localStorage.getItem("admin")
        };
        // const fileName = val.cr_songName;
        // let openUrl =baseUrl +"/song/" + type;
        // window.open(openUrl, "_blank");

        const Base64 = require("js-base64").Base64;
        const exStr = Base64.encodeURI(type);
        const fileName = val.cr_songName;
        let openUrl = baseUrl + "/song/" + exStr;
        window.open(openUrl, "_blank");

        console.log(exStr); // 'YmFzZTY0'
      } else {
        const param = {
          key: localStorage.getItem("admin")
        };
        const fileName = val.cr_songName;
        let openUrl = baseUrlActive + "/" + type;
        window.open(openUrl, "_blank");
      }
    },
    // uploadActive11(val){
    // const  key=localStorage.getItem("admin"),
    // const fileName=val.,
    // const songName
    //   apiUploadNew()

    // },
    //编曲确认上传
    handleOkLoad(e) {
      this.handleSubmit3(e);

      // this.visibleSongLoad = false;
    },
    handleCancelLoad() {
      this.visibleSongLoad = false;
    },
    //上传编曲
    toLoadArrangement(val) {
      (this.uploading = false),
        (this.uploading1 = false),
        (this.uploading2 = false),
        (this.uploading3 = false),
        (this.uploading4 = false),
        (this.uploading5 = false),
        (this.songName = "");
      this.disabledActive3 = true;
      this.disabledActive22 = false;
      this.disabledActive11 = false;
      this.ArrangementDaoChangFileCodeTab = true;
      this.titleTypeActive = "上传编曲";
      this.fileList2 = [];
      this.fileList3 = [];
      this.fileList5 = [];

      this.songName = val.cr_songName;
      this.visibleSongLoad = true;
      this.uploadType = "Arrangement";
    },
    //上传录音
    toLoadRecord(val) {
      this.disabledActive3 = true;
      this.disabledActive22 = false;
      this.disabledActive11 = false;
      this.ArrangementDaoChangFileCodeTab = false;
      this.titleTypeActive = "上传录音";
      this.fileList2 = [];
      this.fileList3 = [];
      this.fileList5 = [];

      this.songName = val.cr_songName;
      this.visibleSongLoad = true;
      this.uploadType = "Record";
    },
    //上传缩混
    toLoadMix(val) {
      this.disabledActive3 = true;
      this.disabledActive22 = false;
      this.disabledActive11 = false;
      this.ArrangementDaoChangFileCodeTab = false;
      this.titleTypeActive = "上传缩混";
      this.fileList2 = [];
      this.fileList5 = [];
      this.songName = val.cr_songName;
      this.visibleSongLoad = true;
      this.uploadType = "Mix";
    },
    //审核通过
    toPass(val) {
      let tampStep = "";

      if (val.state == 7 || val.state == 6 || val.state == 8) {
        tampStep = "arrangement";
      } else if (val.state == 11 || val.state == 12 || val.state == 13) {
        tampStep = "record";
      } else if (val.state == 16 || val.state == 17 || val.state == 18) {
        tampStep = "mix";
      }
      let param = {
        key: localStorage.getItem("admin"),
        songName: val.cr_songName,
        step: tampStep,
        operation: "pass",
        remark: ""
      };

      apiCheckWork(param).then(res => {
        if (res.state == 0) {
          this.$message.success("审核通过操作成功！");
          this.querySongInfo();
        } else {
          this.$message.error("审核通过操作失败！");
          this.querySongInfo();
        }
      });
    },
    //审核驳回
    toBack(val) {
      this.refuseText = "";
      this.refusesongName = val.cr_songName;
      this.refusetampStep = "";
      if (val.state == 7 || val.state == 6 || val.state == 8) {
        this.refusetampStep = "arrangement";
      } else if (val.state == 11 || val.state == 12 || val.state == 13) {
        this.refusetampStep = "record";
      } else if (val.state == 16 || val.state == 16 || val.state == 17) {
        this.refusetampStep = "mix";
      }
      this.visibleRefuse = true;
    },
    //关闭分配制作人弹窗
    handleOkProducer(e) {
      this.handleSubmit2(e);
      this.visibleProducer = false;
    },
    //关闭分配制作人弹窗
    handleCancelProducer(e) {
      this.visibleProducer = false;
    },
    //分配制作人
    toProducer(val, type) {
      this.userList = [];
      console.log(type);
      switch (type) {
        case "Producer":
          this.chooseType = "producer";
          this.titleActive = "分配制作人";
          break;
        case "ArrangementM":
          this.chooseType = "arrangementM";
          this.titleActive = "分配编曲组长";
          break;
        case "RecorderM":
          this.chooseType = "recorderM";
          this.titleActive = "分配录音组长";
          break;
        case "MixerM":
          this.chooseType = "mixerM";
          this.titleActive = "分配缩混组长";
          break;
        case "Arrangement":
          this.titleActive = "分配编曲师";
          this.chooseType = "arrangement";
          break;
        case "Recorder":
          this.titleActive = "分配录音师";
          this.chooseType = "recorder";
          break;
        case "Mixer":
          this.titleActive = "分配混音师";
          this.chooseType = "mixer";
          break;
      }
      this.queryWorker();
      console.log(val);
      this.songID = val.id;
      this.visibleProducer = true;
    },
    //查询账户列表
    queryWorker() {
      const param = {
        key: localStorage.getItem("admin"),
        category: this.chooseType
      };
      apiGetWorker(param).then(res => {
        console.log(res);
        if (res.state == 0) {
          this.userList = res.list;
        } else {
          this.$message.error("获取数据失败，请刷新重新获取！");
        }
      });
    },
    //
    //确认分配制作人
    handleSubmit2(e) {
      e.preventDefault();

      this.form.validateFields((err, values) => {
        const param = {
          key: localStorage.getItem("admin"),
          to: this.ProducerId,
          songID: this.songID,
          work: this.chooseType
        };
        apiAllocatingTask(param).then(res => {
          console.log(res);
          if (res.state == 0) {
            this.$message.success("操作成功!");
            this.querySongInfo();
          } else {
            this.$message.error("操作失败!,请仔细检查歌曲生产");
            this.querySongInfo();
          }
        });
      });
    },
    //确认上传编曲
    handleSubmit3(e) {
      e.preventDefault();

      this.form.validateFields((err, values) => {
        if (this.uploadType == "Arrangement") {
          const param = {
            key: localStorage.getItem("admin"),
            ArrangementFileCode: this.ArrangementLoadCode,
            songName: this.songName,
            ArrangementProjectCode: this.projectCode,
            ArrangementDaoChangFileCode: this.ArrangementDaoChangFileCode
          };
          apiCommitArrangement(param).then(res => {
            console.log(res);
            if (res.state == 0) {
              this.$message.success("上传编曲成功!");
              this.visibleSongLoad = false;
              this.querySongInfo();
            } else {
              this.$message.error("上传编曲失败!");
            }
          });
        } else if (this.uploadType == "Record") {
          const param = {
            key: localStorage.getItem("admin"),
            RecordFileCode: this.ArrangementLoadCode,
            songName: this.songName,
            RecordProjectCode: this.projectCode
          };
          apiCommitRecord(param).then(res => {
            console.log(res);
            if (res.state == 0) {
              this.$message.success("上传录音成功!");
              this.visibleSongLoad = false;
              this.querySongInfo();
            } else {
              this.$message.error("上传录音失败!");
            }
          });
        } else if (this.uploadType == "Mix") {
          const param = {
            key: localStorage.getItem("admin"),
            auditionCode: this.ArrangementLoadCode,
            songName: this.songName,
            projectCode: this.projectCode
          };
          apiCommitMix(param).then(res => {
            console.log(res);
            if (res.state == 0) {
              this.$message.success("上传缩混成功!");
              this.visibleSongLoad = false;
              this.querySongInfo();
            } else {
              this.$message.error("上传缩混失败!");
            }
          });
        }
      });
    },
    //确认上传编曲
    handleSubmit4(e) {
      e.preventDefault();

      this.form.validateFields((err, values) => {
        const param = {
          key: localStorage.getItem("admin"),
          songName: this.songName,
          lyricsCode: this.lyricCode
        };
        apiUpdateLyric(param).then(res => {
          console.log(res);
          this.visibleUpdateLyric = false;
          this.querySongInfo();
        });
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
      //获取嘻哈风格列表
    querySongwriter() {
      const param = {
        key: localStorage.getItem("admin")
      };
      apiGetSongwriter(param).then(res => {
        if (res.status === -1) {
        console.log(res)
          // this.styleList = res.data;
          // this.styleList.unshift("全部");
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

    //获取风格列表
    queryAddStyle() {
      const param = {
        key: localStorage.getItem("admin"),
        operation: 0,
        name: ""
      };
      apiSongStyle(param).then(res => {
        if (res.state == 0) {
          this.styleList = res.data;
          //this.queryAdminInfo();
        } else {
          this.$message.error("获取风格列表失败!");
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
      this.stateValue = value;
    },
    //客户选择
    handleChangeClient(value) {
      this.client = value;
    },
    //客户选择
    handleChangeClient1(value) {
      this.ProducerId = value;
    },
    //删除
    deleteSong(val) {
      let funcGroup = localStorage.getItem("funcGroup").split(",");

      if (
        funcGroup.includes("101") == true ||
        funcGroup.includes("100") == true ||
        funcGroup.includes("102") == true
      ) {
        const param = {
          key: localStorage.getItem("admin"),
          songName: [val.cr_songName]
        };
        apiDeleteSong(param).then(res => {
          if (res.state == 0) {
            this.$message.success("删除成功！");
            this.querySongInfo();
            //localStorage.setItem("admin",res.userName)
            //this.$router.push("/Authority/UserList");
          } else {
            this.$message.error("上传失败，请重新上传！");
          }
        });
      } else {
        this.$message.error("对不起，您暂无该上传权限！");
        return false;
      }
    },

    //确认查询
    queryInfo() {
      this.querySongInfo();
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
      const key = localStorage.getItem("admin");
      //return false
      // You can use any AJAX library you like
      apiUploadComplete(key, formData).then(res => {
        if (res.state == 0) {
          _this.uploading = false;
          _this.disabledActive1 = true;
          if (_this.disabledActive1 == true && _this.disabledActive2 == true) {
            this.disabledActive = false;
          }
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
      const key = localStorage.getItem("admin"); // You can use any AJAX library you like
      apiUploadLyric(key, formData1).then(res => {
        if (res.state == 0) {
          this.lyricCode = res.code;
          _this.uploading1 = false;
          _this.disabledActive2 = true;
          if (_this.disabledActive1 == true && _this.disabledActive2 == true) {
            this.disabledActive = false;
          }

          // localStorage.setItem("admin", res.userName);
          //this.$router.push("/Authority/UserList");
        } else {
          this.$message.error("上传失败，请重新上传！");
        }
      });
    },
    //上传编曲
    handleRemove2(file) {
      const index = this.fileList2.indexOf(file);
      const newFileList = this.fileList2.slice();
      newFileList.splice(index, 1);
      this.fileList2 = newFileList;
    },
    beforeUpload2(file) {
      this.fileList2 = [...this.fileList2, file];
      return false;
    },
    handleUpload2() {
      let _this = this;

      const { fileList2 } = this;
      let formData2 = new FormData();
      formData2 = null;
      formData2 = new FormData();
      fileList2.forEach(file => {
        formData2.append("files[]", file);
      });
      this.uploading2 = true;
      const key = localStorage.getItem("admin"); // You can use any AJAX library you like
      apiUploadComplete(key, formData2).then(res => {
        if (res.state == 0) {
          this.ArrangementLoadCode = res.code;
          _this.uploading2 = false;
          _this.disabledActive11 = true;
          if (
            _this.disabledActive11 == true &&
            _this.disabledActive22 == true
          ) {
            this.disabledActive3 = false;
          }
          // localStorage.setItem("admin", res.userName);
          //this.$router.push("/Authority/UserList");
        } else {
          this.$message.error("上传失败，请重新上传！");
        }
      });
    },
    //上传工程文件
    handleRemove3(file) {
      const index = this.fileList3.indexOf(file);
      const newFileList = this.fileList3.slice();
      newFileList.splice(index, 1);
      this.fileList3 = newFileList;
    },
    beforeUpload3(file) {
      this.fileList3 = [...this.fileList3, file];
      return false;
    },
    handleUpload3() {
      let _this = this;

      const { fileList3 } = this;
      let formData3 = new FormData();
      formData3 = null;
      formData3 = new FormData();
      fileList3.forEach(file => {
        formData3.append("files[]", file);
      });
      this.uploading3 = true;
      // You can use any AJAX library you like
      const filname = this.titleTypeActive+this.songName;
      const key = localStorage.getItem("admin");
      const songName = this.songName;
      console.log(formData3);

      apiUploadNew(formData3, key, filname, songName).then(res => {
        if (res.state == 0) {
          this.projectCode = res.code;
          _this.uploading3 = false;
          _this.disabledActive22 = true;
          if (
            _this.disabledActive11 == true &&
            _this.disabledActive22 == true
          ) {
            this.disabledActive3 = false;
          }
        } else {
          this.$message.error("上传失败，请重新上传！");
        }
      });
    },
    //上传工程文件
    handleRemove5(file) {
      const index = this.fileList5.indexOf(file);
      const newFileList = this.fileList5.slice();
      newFileList.splice(index, 1);
      this.fileList5 = newFileList;
    },
    beforeUpload5(file) {
      this.fileList5 = [...this.fileList5, file];
      return false;
    },
    //上传导唱文件
    handleUpload5() {
      let _this = this;

      const { fileList5 } = this;
      let formData5 = new FormData();
      formData5 = null;
      formData5 = new FormData();
      fileList5.forEach(file => {
        formData5.append("files[]", file);
      });
      this.uploading5 = true;
      // You can use any AJAX library you like
      const filname = "测试";
      const key = localStorage.getItem("admin");
      const songName = this.songName;
      console.log(formData5);

      apiUploadComplete(key, formData5).then(res => {
        if (res.state == 0) {
          this.ArrangementDaoChangFileCode = res.code;
          _this.uploading5 = false;
          _this.disabledActive22 = true;
          if (
            _this.disabledActive11 == true &&
            _this.disabledActive22 == true
          ) {
            this.disabledActive5 = false;
          }
        } else {
          this.$message.error("上传失败，请重新上传！");
        }
      });
    },
    //上传工程文件
    handleRemove4(file) {
      const index = this.fileList4.indexOf(file);
      const newFileList = this.fileList4.slice();
      newFileList.splice(index, 1);
      this.fileList4 = newFileList;
    },
    beforeUpload4(file) {
      this.fileList4 = [...this.fileList3, file];
      return false;
    },
    handleUpload4() {
      let _this = this;

      const { fileList4 } = this;
      let formData4 = new FormData();
      formData4 = null;
      formData4 = new FormData();
      fileList4.forEach(file => {
        formData4.append("files[]", file);
      });
      this.uploading4 = true;
      const key = localStorage.getItem("admin"); // You can use any AJAX library you like

      apiUploadLyric(key, formData4).then(res => {
        if (res.state == 0) {
          this.lyricCode = res.code;
          _this.uploading4 = false;
          _this.disabledActive44 = false;

          // localStorage.setItem("admin", res.userName);
          //this.$router.push("/Authority/UserList");
        } else {
          this.$message.error("上传失败，请重新上传！");
        }
      });
    },
    //上传成品
    loadSongCp() {
      this.disabledActive = true;
      this.disabledActive2 = false;
      this.disabledActive1 = false;
      this.lyricCode = "";
      this.auditionCode = "";
      (this.uploading = false),
        (this.uploading1 = false),
        (this.uploading2 = false),
        (this.uploading3 = false),
        (this.uploading4 = false),
        (this.uploading5 = false),
        this.queryAddStyle();
      let funcGroup = localStorage.getItem("funcGroup").split(",");

      if (
        funcGroup.includes("103") == true ||
        funcGroup.includes("100") == true
      ) {
        this.visibleSongCp = true;
        this.passwordType = true;
        this.titleType = "新增";
        this.fileList1 = [];
        this.fileList = [];
        this.form.resetFields();

        console.log(this.form);
      } else {
        this.$message.error("对不起，您暂无该上传权限！");
        return false;
      }
    },
    //取消上传成品
    handleCancelCp() {
      this.visibleSongCp = false;
    },
    //确认上传成品
    handleOkCp(e) {
      this.handleSubmitCp(e);
    },
    //新增
    loadSong() {
      (this.uploading = false),
        (this.uploading1 = false),
        (this.uploading2 = false),
        (this.uploading3 = false),
        (this.uploading4 = false),
        (this.uploading5 = false),
        (this.disabledActive = true);
      this.disabledActive2 = false;
      this.disabledActive1 = false;
      this.lyricCode = "";
      this.auditionCode = "";
      this.load;
      this.queryAddStyle();
      let funcGroup = localStorage.getItem("funcGroup").split(",");

      if (
        funcGroup.includes("103") == true ||
        funcGroup.includes("100") == true
      ) {
        this.visibleSong = true;
        this.passwordType = true;
        this.titleType = "新增";
        this.fileList1 = [];
        this.fileList = [];
        this.form.resetFields();

        console.log(this.form);
      } else {
        this.$message.error("对不起，您暂无该上传权限！");
        return false;
      }
    },
    //合作伙伴分页
    onShowSizeChange1(current, pageSize) {
      this.current1 = current;
      console.log(current, pageSize);
      this.querySongInfo();
    },
    //生成试听歌单
    createSongList(item) {},
    //查看试听伙伴
    queryPartner(val) {
      const param = {
        key: localStorage.getItem("admin"),
        songName: val.name
      };
      apiQueryAuditionState(param).then(res => {
        if (res.state == 0) {
          this.data1 = res.data;
          this.data1.map(item => {
            item["timess"] = common.getTimes(item.time * 1000);
          });
          this.visiblePartner = true;
        }
      });
    },
    //关闭试听伙伴弹窗
    handleOkPartner() {
      this.visiblePartner = false;
    },
    //关闭试听伙伴弹窗
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
    //试听
    tryAudition(item) {
        this.visibleAudition = true;
      this.songText = "";
this.auditionCodeUrl=""
      if (item.mix_auditionFile === "") {
              const Base64 = require("js-base64").Base64;
      const exStr = Base64.encodeURI(item.cr_demoFile);
        this.auditionCodeUrl = "http://106.53.61.91:8990/song/" + exStr;
      } else {
              const Base64 = require("js-base64").Base64;
      const exStr = Base64.encodeURI(item.mix_auditionFile);
        this.auditionCodeUrl = "http://106.53.61.91:8990/song/" + exStr;
      }

    
      const param = {
        key: localStorage.getItem("admin"),
        code: item.cr_lyricsFile
      };
      apiGetLyricContent(param).then(res => {
         let str = res.content
        // let str = res.content.split("plain")[1];
        // let str1 = str.split("------Web")[0];
       console.log(str)
        this.songText = str;
      });
    },

    //查询歌曲列表
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
          isProduct: true
        }
      };
      apigetSongInfo(param).then(res => {
        this.totalNum = res.count;
        res.data.map((item, index) => {
          item.mixName = baseUrl + "/song/" + item.mixName;
          item["Nums"] = index;
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
          if (item.ar_taskCT !== 0) {
            item.ar_taskCT = common.getTimes(item.ar_taskCT * 1000);
          } else {
            item.ar_taskCT = "暂未开始";
          }
          if (item.ar_taskOT !== 0) {
            item.ar_taskOT = common.getTimes(item.ar_taskOT * 1000);
          } else {
            item.ar_taskOT = "暂未完成";
          }
          if (item.rec_taskCT !== 0) {
            item.rec_taskCT = common.getTimes(item.rec_taskCT * 1000);
          } else {
            item.rec_taskCT = "暂未开始";
          }
          if (item.rec_taskOT !== 0) {
            item.rec_taskOT = common.getTimes(item.rec_taskOT * 1000);
          } else {
            item.rec_taskOT = "暂未完成";
          }
          if (item.mix_taskCT !== 0) {
            item.mix_taskCT = common.getTimes(item.mix_taskCT * 1000);
          } else {
            item.mix_taskCT = "暂未开始";
          }
          if (item.mix_taskOT !== 0) {
            item.mix_taskOT = common.getTimes(item.mix_taskOT * 1000);
          } else {
            item.mix_taskOT = "暂未完成";
          }
        });
        this.data = res.data;
      });
    },
    //新增
    addAdmin() {
      this.visible = true;
      this.passwordType = true;
      this.titleType = "新增";
      this.form.resetFields();
    },
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
        this.tags = values.tags;
        this.librettist = values.librettist;
        this.composer = values.composer;
        if (!err) {
          this.songName = values.songName;
          this.uploadMix();
        }
      });
    },
    //保存成品
    handleSubmitCp(e) {
      e.preventDefault();

      this.form.validateFields((err, values) => {
        this.tags = values.tags;
        this.librettist = values.librettist;
        this.composer = values.composer;
        if (!err) {
          this.songName = values.songName;
          this.uploadMixCp();
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
      this.visibleSong = false;
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
      this.visibleEdit = false;
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
    //分页
    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.querySongInfo();
      console.log(current, pageSize);
    },
    // 上传缩混成品
    uploadMixCp() {
      if (this.auditionCode === "") {
        this.$message.error("歌曲还没上传，请点击开始上传按钮上传歌曲！");
        return false;
      }
      if (this.lyricCode === "") {
        this.$message.error("歌词还没上传，请点击开始上传按钮上传歌词！");
        return false;
      }
      let tempArr = [];
      this.tags.filter(item => {
        tempArr.push(item);
      });
      const param = {
        key: localStorage.getItem("admin"),
        songName: this.songName,
        tag: tempArr,
        librettist: this.librettist,
        composer: this.composer,
        //mixCode: this.mixCode,
        auditionCode: this.auditionCode,
        lyricCode: this.lyricCode
      };
      apiUploadCommitMix(param).then(res => {
        if (res.state == 0) {
          this.visibleSongCp = false;
          this.$message.success("上传成功");
          this.querySongInfo();
        } else {
          this.$message.error("上传失败，请重新上传！");
        }
      });
    },
    //上传缩混
    uploadMix() {
      if (this.auditionCode === "") {
        this.$message.error("歌曲还没上传，请点击开始上传按钮上传歌曲！");
        return false;
      }
      if (this.lyricCode === "") {
        this.$message.error("歌词还没上传，请点击开始上传按钮上传歌词！");
        return false;
      }
      let tempArr = [];
      this.tags.filter(item => {
        tempArr.push(item);
      });
      const param = {
        key: localStorage.getItem("admin"),
        songName: this.songName,
        tag: tempArr,
        lyricist: this.librettist,
        composer: this.composer,
        //mixCode: this.mixCode,
        demoCode: this.auditionCode,
        lyricsCode: this.lyricCode
      };
      apiCommitDemo(param).then(res => {
        if (res.state == 0) {
          this.visibleSong = false;
          this.$message.success("上传成功");
          this.querySongInfo();
        } else {
          this.$message.error("上传失败，请重新上传！");
        }
      });
    },
    handleChange() {}
    //判断权限状态
  }
};
</script>

<style>
.textarea-con {
  border: 1px solid #d9d9d9;
  width: 100%;
  resize: none;
  height: 200px;
  padding: 15px;
}
</style>