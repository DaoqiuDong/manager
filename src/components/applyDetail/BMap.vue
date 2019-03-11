<template>
  <div>
    <el-row v-if="!isEmpty(lbsInfo)">
      <el-col :span="12">
        <p>最近登录时间: <span>{{lbsInfo.location[0].location_time}}</span></p>
      </el-col>
      <el-col :span="12">
        <p>最近登录地点: <span>{{lbsInfo.location[0].addr}}</span></p>
      </el-col>
    </el-row>
    <el-table :data="deviceInfo" :stripe='true'>
      <el-table-column label="手机品牌" prop="brand"></el-table-column>
      <el-table-column label="手机型号" prop="model"></el-table-column>
    </el-table>
    <div id="baiduMap"></div>
  </div>
</template>
<script>
import home from "@/assets/home.png";
import company from "@/assets/company.png";
import deviceicon from "@/assets/map.png";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      deviceInfo: [],
      homeimg: home,
      companyimg: company,
      deviceimg: deviceicon
    };
  },
  computed: {
    ...mapGetters(["dict", "nodeCode"])
  },
  watch: {
    visibile(newval, oldval) {
      if (newval&&!this.isEmpty(this.lbsInfo)) {
        this.mapInit();
        this.deviceInfo = this.lbsInfo.device;
      }
    },
    lbsInfo(newval,oldval){
      if (this.visibile&&!this.isEmpty(newval)) {
        this.mapInit();
        this.deviceInfo = this.lbsInfo.device;
      }
    }
  },
  methods: {
    mapInit() {
      //地图初始化
      var locaList = this.lbsInfo.location;
      var map = new BMap.Map("baiduMap");
      map.centerAndZoom(
        new BMap.Point(
          locaList[0].location_longitude,
          locaList[0].location_latitude
        ),
        15
      );
      var navigationControl = new BMap.NavigationControl({
        // 靠左上角位置
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        // LARGE类型
        type: BMAP_NAVIGATION_CONTROL_LARGE,
        // 启用显示定位
        enableGeolocation: true
      });
      map.addControl(navigationControl);
      map.disable3DBuilding();
      map.enableScrollWheelZoom();

      var opts = {
        width: 250, // 信息窗口宽度
        height: 100, // 信息窗口高度
        title: "位置信息", // 信息窗口标题
        enableMessage: true //设置允许信息窗发送短息
      };
      var addrIcon = new BMap.Icon(this.deviceimg, new BMap.Size(48, 48));
      for (var i = 0; i < locaList.length; i++) {
        var local = locaList[i];
        var marker;
        if (i == 0) {
          marker = new BMap.Marker(
            new BMap.Point(local.location_longitude, local.location_latitude),
            { icon: addrIcon }
          ); // 创建标注
        } else {
          marker = new BMap.Marker(
            new BMap.Point(local.location_longitude, local.location_latitude)
          ); // 创建标注
        }
        var content = local.location_time + "<br/>" + local.addr;
        map.addOverlay(marker); // 将标注添加到地图中
        addClickHandler(content, marker);
      }
      function addClickHandler(content, marker) {
        marker.addEventListener("click", function(e) {
          openInfo(content, e);
        });
      }
      function openInfo(content, e) {
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
        map.openInfoWindow(infoWindow, point); //开启信息窗口
      }

      //地址解析
      //家庭地址解析
      if (!this.isEmpty(this.lbsInfo.liveCity)) {
        var liveGeo = new BMap.Geocoder();
        var liveAddr =
          this.lbsInfo.liveProvince +
          this.lbsInfo.liveCity +
          this.lbsInfo.liveDistrict +
          this.lbsInfo.liveAddr;
        var liveIcon = new BMap.Icon(this.homeimg, new BMap.Size(44, 44));
        geocodeSearch(
          liveGeo,
          liveAddr,
          this.lbsInfo.liveCity,
          "家庭地址:",
          liveIcon
        );
      }
      //公司地址解析
      if (!this.isEmpty(this.lbsInfo.workCity)) {
        var workGeo = new BMap.Geocoder();
        var workAddr =
          this.lbsInfo.workProvince +
          this.lbsInfo.workCity +
          this.lbsInfo.workDistrict +
          this.lbsInfo.workAddr;
        var workIcon = new BMap.Icon(this.companyimg, new BMap.Size(44, 44));
        geocodeSearch(
          workGeo,
          workAddr,
          this.lbsInfo.workCity,
          "工作地址:",
          workIcon
        );
      }
      
      function geocodeSearch(geo, add, city, label, Icon) {
        geo.getPoint(
          add,
          function(point) {
            if (point) {
              var address = new BMap.Point(point.lng, point.lat);
              addMarker(
                address,
                new BMap.Label(label + add, {
                  offset: new BMap.Size(20, -10)
                }),
                Icon
              );
            }
          },
          city
        );
      }

      function addMarker(point, label, Icon) {
        var marker = new BMap.Marker(point, { icon: Icon });
        map.addOverlay(marker);
        marker.setLabel(label);
      }
    }
  },
  props: ["lbsInfo", "visibile"]
};
</script>

<style rel="stylesheet/scss" lang="scss">
#baiduMap {
  height: 600px;
  margin-top: 20px;
}
</style>