import fetch from '@/utils/fetch';

export default {
    install(Vue, option) {
        Vue.prototype.ajax = function (params) {
            let {
                method = "post",
                url,
                data = null,
                responseType
            } = params;
            return fetch({method,url,data,responseType});
        },
        Vue.prototype.pageSize = 10,
        Vue.prototype.count = function (count,mea) {
            if (!this.isEmpty(count)) {
                return count + mea
            }else{
                return "--"
            }
        },
        Vue.prototype.NullToVal = function (param,val) {
            if (this.isEmpty(param)) {
                return val;
            }else{
                return param;
            }
        },
        Vue.prototype.formatterTime = function (time) {
            if (new Date(time)) {
                var date = new Date(time);  
                var y = date.getFullYear();
                var m = date.getMonth() + 1;    
                m = m < 10 ? ('0' + m) : m;    
                var d = date.getDate();    
                d = d < 10 ? ('0' + d) : d;    
                var h = date.getHours();  
                h = h < 10 ? ('0' + h) : h;  
                var minute = date.getMinutes();  
                var second = date.getSeconds();  
                minute = minute < 10 ? ('0' + minute) : minute;    
                second = second < 10 ? ('0' + second) : second;   
                return y + '-' + m + '-' + d;  
            }else{
                return "--"
            }
        },
        Vue.prototype.getClass = function (score) {
            if (score < 60) {
                return 'redText';
            }else if(score > 59&&score < 90){
                return 'yellowText';
            }else if(score > 89&&score < 101){
                return 'greenText';
            }else{
                return 
            }
        },
        Vue.prototype.getDictTit = function (val,valList,title) {
            if (valList&&valList.length) {
                let tit = title||"title",label;
                valList.forEach(element => {
                    if (element.value == val) {
                        label = element[tit];
                    } 
                });
                return label;
            };
        },
        Vue.prototype.getRefuse = function (val,valList,title) {
            if (valList&&valList.length) {
                let tit = title||"desc",label;
                if(val < 20){
                    valList.forEach(element => {
                        if (element.codeType == val) {
                            label = element.typeDesc;
                        } 
                    });
                }else{
                    valList.forEach(element => {
                        if (element.code == val) {
                            label = element.typeDesc + '/' +element[tit];
                        } 
                    });
                }
                return label;
            };
        },
        Vue.prototype.getOptionByArray = function (json, reportName, arr1, arr2, chartType, flag,start) {
            var arr = {};
            var option = {};
            var startVal;
            if (arr1.length > 15) {
                startVal = 100 - Math.round(1500/arr1.length);
            }
            // 根据不同的图表进行创建不同的图表option
            if (chartType == "pie" && flag == 'solid') { // 创建饼图实心的
                option = {
                    title: {
                        text: reportName,
                        left: 'center',
                        bottom: 0,
                        textStyle: {
                            fontWeight: 400,
                            fontSize: 16
                        }
                    },
                    tooltip: {
                        showDelay: 0,
                        show: true,
                        trigger: 'item',
                        formatter: "{b} : {c}条"
                    },
                    calculable: true,
                    series: [{
                        name: "比例",
                        type: chartType,
                        radius: '55%',
                        center: ['50%', '50%'],
                        data: json,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    // position: 'inner',//设置文字显示在内部
                                    formatter: '{b} : {c}条'
                                },
                                labelLine: {
                                    show: true
                                } // 设置是否需要显示指示线
                            }
                        }
                    }]
                };
            }
            if (chartType == "pie" && flag == 'hollow') { // 创建饼图空心的
                option = {
                    tooltip: {
                        showDelay: 0,
                        show: true,
                        trigger: 'item',
                        formatter: "{b} : {c}%"
                    },
        
                    // calculable : true,
                    series: [{
                        name: '',
                        type: 'pie',
                        // radius : ['40%'],
                        radius: ['30%', '60%'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    formatter: '{b} : {c}%'
                                },
                                labelLine: {
                                    show: true
                                }
                            }
        
                        },
                        data: json
                    }]
                };
        
            } else if (chartType == "line" && flag == 'y') { // 创建折线图
                option = {
                    title: {
                        text: reportName,
                        subtext: ''
                    },
                    tooltip: {
                        show: false,
                        trigger: 'axis',
                        formatter: "{b}<br/>{c}%",
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    toolbox: {
                        show: true
                    },
                    calculable: true,
                    xAxis: [{
                            type: 'category',
                            data: arr1
                        },
        
                    ],
                    yAxis: [{
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    }],
                    series: [{
                        // name:'',
                        type: chartType,
                        itemStyle: {
                            normal: {
                                color: '#1E90FF',
                                label: {
                                    show: false
                                }
                            }
                        },
                        lineStyle: {
                            normal: {
                                label: {
                                    show: true
                                }
                            }
                        },
                        // itemStyle:
                        // {normal:{label:{position:'top',show:true}}},
                        data: arr2
                    }]
                };
            } else if (chartType == "line" && flag == 'one') { // 创建一条线图
                option = {
                    title: {
                        text: '',
                        subtext: ''
                    },
                    tooltip: {
                        show: true,
                        showDelay: 0,
                        trigger: 'axis',
                        formatter: "{b}<br/>{c}"
                    },
                    legend: {
                        data: ['']
                    },
                    // calculable : true,
                    grid: {
                        borderWidth: '0px',
                        x: 90
                    },
                    xAxis: [{
                        type: 'category',
                        // boundaryGap : ['0.1','0.1'],
                        splitLine: {
                            show: false
                        },
                        boundaryGap: true, // 类目起始和结束两端空白策略，默认为true留空，false则顶头
                        axisLine: {
                            show: false
                        }, // 坐标轴线
                        axisTick: {
                            show: false
                        }, // 坐标轴小标记，数值轴和时间轴默认不显示
                        data: arr1
                    }],
                    yAxis: [{
                        type: 'value',
                        axisLine: {
                            show: false
                        }, // 坐标轴线
                        axisTick: {
                            show: false
                        } // 坐标轴小标记，数值轴和时间轴默认不显示
                        //axisLabel:{formatter:'{value}'}
                    }],
                    series: [{
                        name: '',
                        type: chartType,
                        smooth: true, // 平滑曲线显示
                        symbol: 'none', // 不显示折线点；标志图形类型，默认自动选择（8种类型循环使用，不显示标志图形可设为'none'）
                        itemStyle: {
                            normal: {
                                // color:'#55aaff',//折线点颜色
                                areaStyle: {
                                    color: 'rgba(85,170,255,0.2)',
                                    type: 'default'
                                },
                                lineStyle: {
                                    color: "#55aaff"
                                },
                                borderWidth: '0px'
                            },
                            borderWidth: '0px'
                        },
                        data: arr2
                    }]
                };
        
        
            } else if (chartType == "line" && flag == '%') { // 创建一条线图
                option = {
                    title: {
                        text: reportName,
                        subtext: ''
                    },
                    tooltip: {
                        showDelay: 0,
                        show: true,
                        trigger: 'axis',
                        formatter: "{b}<br/>{c}%"
                    },
                    legend: {
                        data: ['']
                    },
                    // calculable : true,
                    grid: {
                        borderWidth: '0px'
                    },
                    xAxis: [{
                        type: 'category',
                        // boundaryGap : ['0.1','0.1'],
                        splitLine: {
                            show: false
                        },
                        boundaryGap: true, // 类目起始和结束两端空白策略，默认为true留空，false则顶头
                        axisLine: {
                            show: false
                        }, // 坐标轴线
                        axisTick: {
                            show: false
                        }, // 坐标轴小标记，数值轴和时间轴默认不显示
                        data: arr1
                    }],
                    yAxis: [{
                        type: 'value',
                        axisLine: {
                            show: false
                        }, // 坐标轴线
                        axisTick: {
                            show: false
                        }, // 坐标轴小标记，数值轴和时间轴默认不显示
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    }],
                    series: [{
                        name: '',
                        type: chartType,
                        smooth: true, // 平滑曲线显示
                        symbol: 'none', // 不显示折线点；标志图形类型，默认自动选择（8种类型循环使用，不显示标志图形可设为'none'）
                        itemStyle: {
                            normal: {
                                // color:'#55aaff',//折线点颜色
                                areaStyle: {
                                    color: 'rgba(85,170,255,0.2)',
                                    type: 'default'
                                },
                                lineStyle: {
                                    color: "#55aaff"
                                },
                                borderWidth: '0px'
                            },
                            borderWidth: '0px'
                        },
                        data: arr2
                    }]
                };
            } else if (chartType == "line" && flag == 'count') { // 创建两条线图
                option = {
                    title: {
                        text: reportName,
                        subtext: ''
                    },
                    tooltip: {
                        showDelay: 0,
                        show: true,
                        trigger: 'axis'
                    },
                    legend: {
                        data: [],
                        right:20
                    },
        
                    calculable: true,
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: arr1
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [
                    ]
                };
                for (let index = 0; index < arr2.length; index++) {
                    const element = arr2[index];
                    option.series[index] = {
                        name: element.name,
                        type: chartType,
                        smooth: true,
                        data: element.data
                    };
                    option.legend.data[index] = element.name;
                }
            } else if (chartType == "bar" && flag == 'right') { // 创建柱状图并且y坐标轴在右边显示
                option = {
                    title: {
                        text: reportName,
                        subtext: ''
                    },
                    tooltip: {
                        show: false,
                        trigger: 'axis',
                        formatter: "{b}<br/>{c}",
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    toolbox: {
                        show: true
                    },
                    calculable: true,
                    xAxis: [{
                            type: 'category',
                            data: arr1,
                            axisLabel: {
                                textStyle: {
                                    color: "black", // 刻度颜色
                                    fontSize: 9 // 刻度大小
                                }
                            }
                        },
        
                    ],
                    yAxis: [{
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    }],
                    series: [{
                        // barWidth : 50,//柱图宽度
                        // name:'',
                        type: chartType,
                        itemStyle: {
                            normal: {
                                color: '#1E90FF',
                                label: {
                                    show: true
                                }
                            }
                        },
                        data: arr2
                    }]
                };
            } else if (chartType == "bar" && flag == 'left') { // 创建柱状图并且y坐标轴在右边显示
                option = {
                    title: {
                        text: reportName,
                        subtext: ''
                    },
                    tooltip: {
                        show: true,
                        showDelay: 0,
                        trigger: 'axis',
                        formatter: "{b}：{c}%",
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    toolbox: {
                        show: false
                    },
                    grid: {
                        borderWidth: '0px'
                    },
                    xAxis: [{
                        type: 'category',
                        data: arr1,
                        splitLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        } // 坐标轴线
                    }],
                    yAxis: [{
                        // position:'left',//设置y显示在右边
                        type: 'value',
                        // lineStyle:{show:false},
                        axisLine: {
                            show: false
                        }, // 坐标轴线
                        axisTick: {
                            show: false
                        }, // 坐标轴小标记，数值轴和时间轴默认不显示
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    }],
                    series: [{
                        // barWidth : 50,//柱图宽度
                        // name:'',
                        type: chartType,
                        itemStyle: {
                            normal: {
                                color: '#1E90FF',
                                label: {
                                    show: false
                                }
                            }
                        },
                        data: arr2
                    }]
                };
                if (arr2.length <= 10) {
                    option.series[0].barWidth = 46;
                }
            } else if (chartType == "bar" && flag == 'count') { // 创建多个柱状图并且y坐标轴在右边显示
                option = {
                    color:["#8693f3","#bc8dee","#ffa897","#89c3f8","#f889b5"],
                    title: {
                        text: reportName,
                        subtext: ''
                    },
                    tooltip: {
                        show: true,
                        showDelay: 0,
                        trigger: 'axis',
                        // formatter: "{b}：{c}",
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data:[],
                        right:40
                        // itemGap: 5
                    },
                    toolbox: {
                        show: false
                    },
                    grid: {
                        borderWidth: '0px'
                    },
                    dataZoom:[{
                        show: true,
                        start: startVal||0,
                        end: 100
                    },
                    {
                        type: 'inside',
                        start: startVal||0,
                        end: 100
                    }],
                    xAxis: [{
                        type: 'category',
                        data: arr1,
                        splitLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        } // 坐标轴线
                    }],
                    yAxis: [{
                        // position:'left',//设置y显示在右边
                        type: 'value',
                        // lineStyle:{show:false},
                        axisLine: {
                            show: false
                        }, // 坐标轴线
                        axisTick: {
                            show: false
                        }, // 坐标轴小标记，数值轴和时间轴默认不显示
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }],
                    series: []
                };
                for (let index = 0; index < arr2.length; index++) {
                    const element = arr2[index];
                    option.series[index] = {
                        name:element.name,
                        type:"bar",
                        data:element.data
                    };
                    option.legend.data[index] = element.name;
                };
            }else if (chartType == "bar" && flag == 'line') { // 创建多个柱状图并且y坐标轴在右边显示
                option = {
                    color:["#89c3f8","#f889b5","#ffa897","#89c3f8","#f889b5"],
                    title: {
                        text: reportName,
                        subtext: ''
                    },
                    tooltip: {
                        show: true,
                        showDelay: 0,
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data:[],
                        right:20
                    },
                    toolbox: {
                        show: false
                    },
                    grid: {
                        borderWidth: '0px'
                    },
                    xAxis: [{
                        type: 'category',
                        data: arr1,
                        splitLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        } // 坐标轴线
                    }],
                    yAxis: [{
                        // position:'left',//设置y显示在右边
                        type: 'value',
                        // lineStyle:{show:false},
                        axisLine: {
                            show: false
                        }, // 坐标轴线
                        axisTick: {
                            show: false
                        }, // 坐标轴小标记，数值轴和时间轴默认不显示
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }],
                    dataZoom:[{
                        show: true,
                        start: startVal||0,
                        end: 100
                    },
                    {
                        type: 'inside',
                        start: startVal||0,
                        end: 100
                    }],
                    series: []
                };
                for (let index = 0; index < arr2.length; index++) {
                    const element = arr2[index];
                    // console.log(element);
                    option.series[index] = {
                        name:element.name,
                        type:element.type,
                        data:element.data
                    };
                    option.legend.data[index] = element.name;
                }
            } else if (chartType == 'map' && flag == 'count') { // 创建地图,当需要返回省份数据为数量时
                option = {
                    title: {
                        text: reportName,
                        subtext: '',
                        x: 'left'
                    },
        
                    tooltip: {
                        showDelay: 0,
                        trigger: 'item',
                        formatter: function (params, ticket, callback) {
                            var res = params.name + ':';
                            if (parseInt(params.value) > 0) {
                                return res + params.value;
                            } else {
                                return
                                res + '0';
                            }
                        }
                    },
        
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: ['']
                    },
                    dataRange: {
                        show: false,
                        x: 'left',
                        y: 'bottom',
                        splitList: [{
                                start: 150000,
                                color: '#8B008B'
                            },
                            {
                                start: 50000,
                                end: 150000,
                                color: '#8B2252'
                            },
                            {
                                start: 20000,
                                end: 50000,
                                color: '#8B3A3A'
                            },
                            {
                                start: 5000,
                                end: 20000,
                                color: '#8B4513'
                            },
                            {
                                start: 1000,
                                end: 5000,
                                label: '1000 到 5000',
                                color: '#8B4C39'
                            },
                            {
                                start: 500,
                                end: 1000,
                                color: '#8B5F65'
                            },
                            {
                                start: 100,
                                end: 500,
                                color: '#8B6914'
                            },
                            {
                                start: 40,
                                end: 100,
                                color: '#8B7765'
                            },
                            //	{start: 1, end: 40, color: '#BDE61A'}
                            {
                                start: 1,
                                end: 40,
                                color: '#8B7D7B'
                            }
                        ]
                        //color: ['#E0022B', '#E09107', '#A3E00B']
                        //color: ['#FF3030', '#FF6EB4', '#FF8C00','#FFC1C1','#FFE4E1']
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        x: 'right',
                        y: 'center'
                    },
                    series: [{
                        name: reportName,
                        type: chartType,
                        mapType: 'china',
                        roam: false,
                        selectedMode: 'single',
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    textStyle: {
                                        color: "rgb(249, 249, 249)"
                                    }
                                }
                            },
                            emphasis: {
                                label: {
                                    show: true
                                }
                            }
                        },
                        data: json
                    }]
                };
            } else if (chartType == 'map' && flag == 'rate') { // 创建地图,当需要返回省份数据为比例时
                option = {
                    title: {
                        text: reportName,
                        subtext: '',
                        x: 'left'
                    },
                    tooltip: {
                        showDelay: 0,
                        trigger: 'item',
                        formatter: function (params, ticket, callback) {
                            var res = params.name + ':';
                            if (parseInt(params.value) > 0) {
                                return res + params.value + '%';
                            } else {
                                return res + '0';
                            }
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: ['']
                    },
                    dataRange: {
                        show: false,
                        x: 'left',
                        y: 'bottom',
                        splitList: [{
                                start: 70,
                                end: 100,
                                color: '#8B0000'
                            },
                            {
                                start: 50,
                                end: 70,
                                color: '#8B1C62'
                            },
                            {
                                start: 30,
                                end: 50,
                                color: '#8B3626'
                            },
                            {
                                start: 20,
                                end: 30,
                                color: '#8B4500'
                            },
                            {
                                start: 10,
                                end: 20,
                                color: '#8B4789'
                            },
                            {
                                start: 1,
                                end: 10,
                                color: '#8B5A2B'
                            }
                        ]
                        //color: ['#E0022B', '#E09107', '#A3E00B']
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        x: 'right',
                        y: 'center'
                    },
                    series: [{
                        name: reportName,
                        type: chartType,
                        mapType: 'china',
                        roam: false,
                        selectedMode: 'single',
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    textStyle: {
                                        color: "rgb(249, 249, 249)"
                                    }
                                }
                            },
                            emphasis: {
                                label: {
                                    show: true
                                }
                            }
                        },
                        data: json
                    }]
                };
            }
            return option;
        },
        Vue.prototype.getNewOptionByArray = function (json, reportName, arr1, arr2, arr3, arr4, chartType, flag, name1, name2, name3, name4,maxItem) {
            var arr = {};
            var option = {};
            if (chartType == "line" && flag == 'three') { // 创建两条线图
                option = {
                    title: {
                        text: '',
                        subtext: ''
                    },
                    tooltip: {
                        show: true,
                        showDelay: 0,
                        trigger: 'axis'
                        //  formatter:"{b}<br/>{c}",	
                    },
                    color: ['#55aaff', '#96c600', '#FF0000'],
                    legend: {
                        data: [name1, name2, name3]
                    },
                    grid: {
                        borderWidth: '0px'
                    },
                    xAxis: [{
                        type: 'category',
                        splitLine: {
                            show: false
                        },
                        boundaryGap: true, // 类目起始和结束两端空白策略，默认为true留空，false则顶头
                        axisLine: {
                            show: false
                        }, // 坐标轴线
                        axisTick: {
                            show: false
                        }, // 坐标轴小标记，数值轴和时间轴默认不显示
                        data: json
                    }],
                    yAxis: [{
                        type: 'value',
                        axisLine: {
                            show: false
                        }, // 坐标轴线
                        axisTick: {
                            show: false
                        } // 坐标轴小标记，数值轴和时间轴默认不显示
                    }],
                    series: [{
                            name: name1,
                            type: chartType,
                            smooth: true,
                            symbol: 'none', // 不显示折线点；标志图形类型，默认自动选择（8种类型循环使用，不显示标志图形可设为'none'）
                            itemStyle: {
                                normal: {
                                    // //color:'#55aaff',//折线点颜色
                                    areaStyle: {
                                        color: 'rgba(85,170,255,0.05)',
                                        type: 'default'
                                    },
                                    lineStyle: {
                                        color: "#55aaff"
                                    }
                                }
                            },
                            data: arr1
                        },
                        {
                            name: name2,
                            type: chartType,
                            smooth: true,
                            symbol: 'none', // 不显示折线点；标志图形类型，默认自动选择（8种类型循环使用，不显示标志图形可设为'none'）
                            itemStyle: {
                                normal: {
                                    // //color:'#55aaff',//折线点颜色
                                    areaStyle: {
                                        color: 'rgba(86,207,67,0.05)',
                                        type: 'default'
                                    },
                                    lineStyle: {
                                        color: "#56cf43"
                                    }
                                }
                            },
                            data: arr2
                        },
                        {
                            name: name3,
                            type: chartType,
                            smooth: true,
                            symbol: 'none', // 不显示折线点；标志图形类型，默认自动选择（8种类型循环使用，不显示标志图形可设为'none'）
                            itemStyle: {
                                normal: {
                                    // //color:'#55aaff',//折线点颜色
                                    areaStyle: {
                                        color: 'rgba(86,207,67,0.05)',
                                        type: 'default'
                                    },
                                    lineStyle: {
                                        color: "#FF0000"
                                    }
                                }
                            },
                            data: arr3
                        }
                    ]
                };
            } else if (chartType == "bar" && flag == 'left') { // 创建柱状图并且y坐标轴在右边显示
                option = {
                    title: {
                        text: reportName,
                        subtext: ''
                    },
                    tooltip: {
                        show: true,
                        showDelay: 0,
                        trigger: 'axis',
                        formatter: "{b}：{c}",
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
        
                    legend: {
                        data: [name1, name2, name3]
                    },
                    xAxis: [{
                        type: 'category',
                        data: json,
                        splitLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        } // 坐标轴线
                    }],
                    yAxis: [{
                        // position:'left',//设置y显示在右边
                        type: 'value',
                        // lineStyle:{show:false},
                        axisLine: {
                            show: false
                        }, // 坐标轴线
                        axisTick: {
                            show: false
                        } // 坐标轴小标记，数值轴和时间轴默认不显示
                        //  axisLabel:{formatter:'{value}%'}
                    }],
                    series: [{
                        name: name1,
                        barWidth: 50, //柱图宽度
                        type: chartType,
                        itemStyle: {
                            normal: {
                                color: function (params) {
                                    var index_color = params.value;
                                    if (index_color >= 0 && index_color <= 10) {
                                        return '#fe4365';
                                    } else if (index_color > 10 && index_color <= 30) {
                                        return '#25daba';
                                    } else if (index_color > 30 && index_color <= 50) {
                                        return '#EEAD0E';
                                    }
                                },
        
                                label: {
                                    show: false
                                }
                            }
                        },
                        data: arr1,
                        markLine: {
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        type: 'solid',
                                        color: '#000'
                                    },
                                    label: {
                                        show: true,
                                        position: 'left'
                                    }
                                }
                            },
                            data: [
                                //           {name: '标准线',value: 30, xAxis: 1, yAxis: 20 }  
                                {
                                    name: '标准线',
                                    yAxis: 15
                                }
                            ]
                        }
                    }]
                };
                if (arr1.length <= 10) {
                    option.series[0].barWidth = 46;
                }
            } else if (chartType == "bar" && flag == 'uad') { //创建上下有两个柱状图图表
        
                option = {
                    title: {
                        text: reportName,
                        subtext: ''
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            animation: false
                        }
                    },
                    legend: {
                        data: [name1, name2],
                        x: 'center'
                    },
                    /*    toolbox: {
                            feature: {
                                dataZoom: {
                                    yAxisIndex: 'none'
                                },
                                restore: {},
                                saveAsImage: {}
                            }
                        },*/
                    axisPointer: {
                        link: {
                            xAxisIndex: 'all'
                        }
                    },
                    dataZoom: [{
                            show: true,
                            realtime: true,
                            start: 66,
                            end: 100,
                            xAxisIndex: [0, 1],
                            zoomLock: true
                        },
                        {
                            type: 'inside',
                            realtime: true,
                            start: 10,
                            end: 90,
                            zoomLock: true,
                            xAxisIndex: [0, 1]
                        }
                    ],
                    grid: [{
                        left: 40,
                        right: 50,
                        height: '35%'
                    }, {
                        left: 40,
                        right: 50,
                        top: '60%',
                        height: '35%'
                    }],
                    xAxis: [{
                            type: 'category',
                            //        boundaryGap : false,
                            axisLine: {
                                onZero: true
                            },
                            data: arr1,
                            axisTick: {
                                alignWithLabel: true,
                                interval: 0
                            },
                            axisLabel: {
                                interval: 4
                            }
                        },
                        {
                            gridIndex: 1,
                            type: 'category',
                            //         boundaryGap : false,
                            axisLine: {
                                onZero: true
                            },
                            data: arr2,
                            position: 'top',
                            axisTick: {
                                alignWithLabel: true,
                                interval: 0
                            },
                            axisLabel: {
                                interval: 4
                            }
                        }
                    ],
                    yAxis: [{
                            name: '',
                            type: 'value',
                            // max:'dataMax'
                            max : maxItem
                        },
                        {
                            gridIndex: 1,
                            name: '',
                            type: 'value',
                            inverse: true,
                            max:maxItem
                        }
                    ],
                    series: [{
                            name: name1,
                            barWidth: 10, //柱图宽度
                            type: chartType,
                            symbolSize: 8,
                            hoverAnimation: false,
                            data: arr3
                        },
                        {
                            name: name2,
                            barWidth: 10, //柱图宽度
                            type: chartType,
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            symbolSize: 8,
                            hoverAnimation: false,
                            data: arr4
                        }
                    ]
                };
            } else if (chartType == "bar" && flag == 'wide') { //创建上下有两个柱状图图表
        
                option = {
                    title: {
                        text: reportName,
                        subtext: ''
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            animation: false
                        }
                    },
                    legend: {
                        data: [name1, name2],
                        x: 'center'
                    },
                    /*    toolbox: {
                            feature: {
                                dataZoom: {
                                    yAxisIndex: 'none'
                                },
                                restore: {},
                                saveAsImage: {}
                            }
                        },*/
                    axisPointer: {
                        link: {
                            xAxisIndex: 'all'
                        }
                    },
                    // dataZoom: [{
                    // 		show: true,
                    // 		realtime: true,
                    // 		start: 0,
                    // 		end: 100,
                    // 		zoomLock: true,
                    // 		xAxisIndex: [0, 1]
                    // 	},
                    // 	{
                    // 		type: 'inside',
                    // 		realtime: true,
                    // 		start: 10,
                    // 		end: 90,
                    // 		zoomLock: true,
                    // 		xAxisIndex: [0, 1]
                    // 	}
                    // ],
                    grid: [{
                        left: 40,
                        right: 50,
                        height: '35%'
                    }, {
                        left: 40,
                        right: 50,
                        top: '60%',
                        height: '35%'
                    }],
                    xAxis: [{
                            type: 'category',
                            //        boundaryGap : false,
                            //    axisLine: {onZero: true},
                            data: arr1
                        },
                        {
                            gridIndex: 1,
                            type: 'category',
                            //         boundaryGap : false,
                            //    axisLine: {onZero: true},
                            data: arr2,
                            position: 'top'
                        }
                    ],
                    yAxis: [{
                            name: '',
                            type: 'value',
                            max : maxItem
                        },
                        {
                            gridIndex: 1,
                            name: '',
                            type: 'value',
                            inverse: true,
                            max : maxItem					
                        }
                    ],
                    series: [{
                            name: name1,
                            barWidth: 30, //柱图宽度
                            type: chartType,
                            symbolSize: 8,
                            hoverAnimation: false,
                            data: arr3,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside'
                                }
                            }
                        },
                        {
                            name: name2,
                            barWidth: 30, //柱图宽度
                            type: chartType,
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            symbolSize: 8,
                            hoverAnimation: false,
                            data: arr4,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside'
                                }
                            }
        
                        }
                    ]
                };
            } else if (chartType == "pie" && flag == '') { //创建饼图
                option = {
                    title: {
                        text: '',
                        subtext: '',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: [name1]
                    },
                    series: [{
                        name: name1,
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: arr1,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                };
        
            } else if (chartType == "pie" && flag == 'rose') { //创建玫瑰图表
                option = {
                    title: {
                        text: '南丁格尔玫瑰图',
                        subtext: '纯属虚构',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        x: 'center',
                        y: 'bottom',
                        data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {
                                show: true
                            },
                            dataView: {
                                show: true,
                                readOnly: false
                            },
                            magicType: {
                                show: true,
                                type: ['pie', 'funnel']
                            },
                            restore: {
                                show: true
                            },
                            saveAsImage: {
                                show: true
                            }
                        }
                    },
                    calculable: true,
                    series: [{
                            name: '半径模式',
                            type: 'pie',
                            radius: [20, 110],
                            center: ['25%', 200],
                            roseType: 'radius',
                            width: '40%', // for funnel
                            max: 40, // for funnel
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: true
                                    },
                                    labelLine: {
                                        show: true
                                    }
                                }
                            },
                            data: [{
                                    value: 10,
                                    name: 'rose1'
                                },
                                {
                                    value: 5,
                                    name: 'rose2'
                                },
                                {
                                    value: 15,
                                    name: 'rose3'
                                },
                                {
                                    value: 25,
                                    name: 'rose4'
                                },
                                {
                                    value: 20,
                                    name: 'rose5'
                                },
                                {
                                    value: 35,
                                    name: 'rose6'
                                },
                                {
                                    value: 30,
                                    name: 'rose7'
                                },
                                {
                                    value: 40,
                                    name: 'rose8'
                                }
                            ]
                        },
                        {
                            name: '面积模式',
                            type: 'pie',
                            radius: [30, 110],
                            center: ['75%', 200],
                            roseType: 'area',
                            x: '50%', // for funnel
                            max: 40, // for funnel
                            sort: 'ascending', // for funnel
                            data: [{
                                    value: 10,
                                    name: 'rose1'
                                },
                                {
                                    value: 5,
                                    name: 'rose2'
                                },
                                {
                                    value: 15,
                                    name: 'rose3'
                                },
                                {
                                    value: 25,
                                    name: 'rose4'
                                },
                                {
                                    value: 20,
                                    name: 'rose5'
                                },
                                {
                                    value: 35,
                                    name: 'rose6'
                                },
                                {
                                    value: 30,
                                    name: 'rose7'
                                },
                                {
                                    value: 40,
                                    name: 'rose8'
                                }
                            ]
                        }
                    ]
                };
        
        
            } else if (chartType == "scatter" && flag == '') { //创建气泡图
        
                option = {
                    title: {
                        text: reportName
                    },
                    legend: {
                        data: [name1],
                        left: 'right'
                    },
                    tooltip: {
                        position: 'top',
                        formatter: function (params) {
                            return json[params.value[0]] + '在' + params.value[1] + ' 通话 ' + params.value[2] + '条';
                        }
                    },
                    dataZoom: [{
                        show: true,
                        realtime: true,
                        start: 66,
                        end: 100,
                        zoomLock: true
                      },
                      {
                        type: 'inside',
                        realtime: true,
                        zoomLock: true,
                        start: 0,
                        end: 20
                      }
                    ],
                    grid: {
                        left: 30,
                        bottom: 50,
                        right: 30,
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: json,
                        boundaryGap: false,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#999',
                                type: 'dashed'
                            }
                        },
                        axisLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: arr1,
                        axisLine: {
                            show: false
                        }
                    },
                    series: [{
                        name: name1,
                        type: chartType,
                        symbolSize: function (val) {
                            return val[2] * 5;
                        },
                        data: arr2,
                        animationDelay: function (idx) {
                            return idx * 1;
                        }
                    }]
                };
        
            }
            return option;
        },
        Vue.prototype.isEmpty = function(value) {
            if (value == null || typeof(value) === "undefined") {
                return true;
            }
            if (typeof(value) === "string" && value == "") {
                return true;
            }
            if (typeof(value) === "object") {
                for (var i in value) {
                    if (value.hasOwnProperty(i)) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        },
        Vue.prototype.emptyOf = function(value) {
            if (value == null || typeof(value) === "undefined") {
                return "--";
            }
            if (typeof(value) === "string" && value == "") {
                return "--";
            }
            if (typeof(value) === "object") {
                for (var i in value) {
                    if (value.hasOwnProperty(i)) {
                        return value;
                    }
                }
                return "--";
            }
            return value;
        },
        Vue.prototype.isEmail = function(value) {
            if (value == null || typeof(value) == "undefined" || value == "") {
                return false;
            }
            var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
            if (!reg.test(value)) {
                return false
            }
            return true;
        },
        Vue.prototype.hasBtnAuth = function (code,btnList) {
            if (code&&btnList&&btnList.length) {
                return btnList.some( btnItem => {
                    return btnItem[code]
                });
            };
            return false
        },
        Vue.prototype.getbtnName = function (code,btnList) {
            var btnInfo = {};
            btnList.forEach(element => {
                if (element[code]) {
                    btnInfo = element[code];
                    return false
                }
            });
            return btnInfo.name;
        }
        
    }
}