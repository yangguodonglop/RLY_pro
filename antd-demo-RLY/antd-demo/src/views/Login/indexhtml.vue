<template>
  <div class="hello">
    <div class="text">
           <span>绕</span><span>梁</span><span>音</span>
      <span>正</span><span>在</span><span>建</span><span>设</span><span>中</span>

</div>

<div style="text-align:center;clear:both">

</div>
  </div>
</template>

<script>
import { apiAddress, apiLogin } from "@/request/api"; // 导入我们的api接口
import routerActive from "@/router";
import axios from "axios";
import Qs from "qs";
import menu from "../Home/menu";

const constrouter = menu.menu;
export default {
  name: "",
  props: {
    msg: String
  },
  data() {
    return {
    };
  },
  mounted: function() {
  

  },
  methods: {
  }
  
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hello {
  width: 100%;
  height: 100%;
  background-color: #333;

}
body {
  background-color: #333;
}

.text {
  margin: 0 auto;
  font-size: 90px;
  font-weight: bold;
  text-align: center;
  position: relative;
  white-space: nowrap;
}
.text::before {
  background-color: #555;
  border-radius: 50%;
  box-shadow: 0 2px 15px #222;
  content: "";
  display: block;
  margin: auto;
  left: 0;
  right: 0;
  bottom: -120px;
  position: absolute;
  width: 900px;
  height: 100px;
}
.text span {
  display: inline-block;
  text-align: center;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  width: 1.75em;
}
.text span:nth-child(1) {
  color: #e61a00;
}
.text span:nth-child(2) {
  color: #cc3300;
}
.text span:nth-child(3) {
  color: #b34d00;
}
.text span:nth-child(4) {
  color: #996600;
}
.text span:nth-child(5) {
  color: olive;
}
.text span:nth-child(6) {
  color: #669900;
}
.text span:nth-child(7) {
  color: #4db300;
}
.text span:nth-child(8) {
  color: #33cc00;
}
.text span:nth-child(9) {
  color: #1ae600;
}
.text span:nth-child(10) {
  color: lime;
}



</style>
