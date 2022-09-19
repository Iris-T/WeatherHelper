<template>
    <div class="flex flex-col flex-1 items-center">
        <!-- Banner -->
        <div v-if="route.query.preview"
        class="text-white p-4 bg-weather-secondary w-full text-center">
            <p>
                您现在正在查看该城的天气信息,可点击"+"号图标在首页关注该城市
            </p>
        </div>

        <!-- 天气信息 -->
        <div class="flex flex-col items-center text-white py-12">
            <h1 class="text-4xl mb-2">{{ route.params.place }}</h1>
            <p class="text-sm mb-12 text-left">
                <p>数据时间: {{ weatherData.current.dt }}</p>
                <span>日照时间: {{ weatherData.current.sunrise.split(' ')[1] }}</span>
                ~
                <span>{{ weatherData.current.sunset.split(' ')[1] }}</span>
            </p>
            <p class="text-6xl mb-6">
                {{ Math.round(weatherData.current.temp) }}&#8451;
            </p>
            <div class="text-center">
                <p>
                    体感温度
                    {{ Math.round(weatherData.current.feels_like) }}&#8451;
                </p>
                <p class="capitalize">
                    {{ weatherData.current.weather[0].description }}
                </p>
                <img class="w-[150px] h-auto"
                :src="`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`"
                alt="">
            </div>
        </div>

        <hr class="border-white border-opacity-10 border w-full" />

        <!-- 小时-范围天气趋势 -->
        <div class="max-w-screen-md w-full py-12">
            <div class="mx-8 text-white">
                <h2 class="md-4">24小时天气趋势</h2>
                <div class="flex gap-10 overflow-x-scroll">
                    <div v-for="hourData in weatherData.hourly"
                    :key="hourData.dt"
                    class="flex flex-col gap-4 items-center">
                    <p class="whitespace-nowrap text-md">
                        {{ hourData.dt }}
                    </p>
                    <img class="w-auto h-[50px] object-cover"
                    :src="`https://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`"
                    alt="" />
                    <p class="text-xl">
                        {{ Math.round(hourData.temp) }}&#8451;
                    </p>
                </div>
                </div>
            </div>
        </div>

        <hr class="border-white border-opacity-10 border w-full" />

        <!-- 一周的天气趋势 -->
        <div class="max-w-screen-md w-full py-12">
            <div class="mx-8 text-white">
                <h2 class="mb-4">7天天气趋势</h2>
                <div v-for="day in weatherData.daily"
                :key="day.dt"
                class="flex items-center">
                <p class="flex-1">
                    {{ day.dt }}
                </p>
                <img class="w-[50px] h-[50px] object-cover"
                :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`"
                alt="">

                <div class="flex gap-2 flex-1 justify-end">
                    <p>{{ Math.round(FToC(day.temp.min)) }}
                    ~
                    <span>{{ Math.round(FToC(day.temp.max)) }}</span>
                    </p>
                </div>
            </div>
            </div>
        </div>

        <div class="flex items-center gap-2 py-12 text-white cursor-pointer duration-150 hover:text-red-500"
        @click="removeCity"
        v-if="!route.query.preview">
            <i class="fa-solid fa-trash"></i>
            <p>删除城市信息</p>
        </div>
    </div>
</template>

<script setup>
import { toNumber } from '@vue/shared';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();

// 时间转换
const timestampToTime = (timestamp) => {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
    return Y+M+D+h+m+s;
}

// 温度转换
const FToC = (degree) => {
    return (degree - 32) / 1.8
}

const getWeatherData = async () => {
    try {

        // ApiKey
        // 7efa332cf48aeb9d2d391a51027f1a71
        // 3213ac05f30cc2f7d8d8da6d2b03f2e8
        const weatherData = await axios.get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${route.query.lat}&lon=${route.query.lon}&exclude={part}&appid=7efa332cf48aeb9d2d391a51027f1a71&units=imperial&lang=zh_cn`
        );
        // 处理当前时间
        weatherData.data.current.dt = timestampToTime(weatherData.data.current.dt * 1000);
        
        // 处理24小时的时间轴
        weatherData.data.hourly.forEach(hour => {
            // 处理时间
            const arr = timestampToTime(hour.dt * 1000).split(' ')[1].split(':');
            hour.dt = arr[0] + ':' + arr[1];
            // 处理温度
            hour.temp = FToC(hour.temp);
            hour.feels_like = FToC(hour.feels_like);
        });

        // 处理7天的时间轴
        weatherData.data.daily.forEach(day => {
            // 处理时间
            const arr = timestampToTime(day.dt * 1000).split(' ')[0].split('-');
            day.dt = arr[1] + '/' + arr[2];
        });

        // 处理日出、日落时间
        weatherData.data.current.sunrise = timestampToTime(weatherData.data.current.sunrise * 1000);
        weatherData.data.current.sunset = timestampToTime(weatherData.data.current.sunset * 1000);
        // 处理温度数据 转为摄氏度
        weatherData.data.current.temp = FToC(weatherData.data.current.temp);
        weatherData.data.current.feels_like = FToC(weatherData.data.current.feels_like);
        
        // 增加延迟完成用户体验
        // await new Promise(res => {
        //     setTimeout(res, 300);
        // });
        
        return weatherData.data;
    } catch(err) {
        console.log(err);
    }
}

const weatherData = await getWeatherData();

// 定义路由，在删除后返回首页
const router = useRouter();
const removeCity = () => {
    const cities = JSON.parse(
        localStorage.getItem('savedCities')
    );
    const updatedCities = cities.filter(city => {
        city.id !== route.query.id;
    });
    localStorage.setItem('savedCities', JSON.stringify(
        updatedCities
    ));

    // 跳转回主页
    router.push({
        name: 'home',
    });
};
</script>