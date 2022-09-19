<template>
    <div v-for="city in savedCities"
    :key="city.id">
        <CityCard :city="city"
        @click="goToCityView(city)" />
    </div>

    <p v-if="savedCities.length === 0"
    class="text-center">
        您暂时没有关心的城市天气信息哦~
    </p>
</template>

<script setup>

import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CityCard from './CityCard.vue';


const savedCities = ref([]);

const getCities = async () => {
    if (localStorage.getItem('savedCities')) {
        savedCities.value = JSON.parse(
            localStorage.getItem('savedCities')
        );
    
        const requests = [];
        savedCities.value.forEach(city => {
            requests.push(
                axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lon}&exclude={part}&appid=7efa332cf48aeb9d2d391a51027f1a71&units=imperial&lang=zh_cn`
                )
            );
        });

        const weatherData = await Promise.all(requests);

        // 停顿让城市卡片（CityCard）闪烁效果得以实现
        await new Promise(res => {
            setTimeout(res, 300);
        });

        weatherData.forEach((value, index) => {
            savedCities.value[index].weather = value.data;
        });
    }
};

await getCities();

const router = useRouter();
const goToCityView = (city) => {
    router.push({
        name: 'cityView',
        params: {
            place: city.place,
            place_name: city.place_name,
        },
        query: {
            city: city.id,
            lat: city.coords.lat,
            lon: city.coords.lon,
        },
    });
};
</script>