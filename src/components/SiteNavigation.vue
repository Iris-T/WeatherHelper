<template>
    <header class="sticky top-0 bg-weather-primary shadow-lg">
        <nav class="container flex flex-col sm:flex-row
        items-center gap-4 text-white py-6">
            <RouterLink :to="{name: 'home'}">
                <div class="flex items-center gap-3">
                    <i class="fa-solid fa-sun text-2xl"></i>
                    <p class="text-2xl">天气小助手</p>
                </div>
            </RouterLink>

            <div class="flex gap-3 flex-1 justify-end">
                <!-- 信息图标 -->
                <i class="fa-solid fa-circle-info text-xl hover:text-weather-secondary duration-150 cursor-pointer"
                 @click="toggleModal"></i>
                <!-- 添加城市 -->
                <i class="fa-solid fa-plus text-xl hover:text-weather-secondary duration-150 cursor-pointer"
                v-if="route.query.preview"
                @click="addCity()"
                ></i>
            </div>

            <BaseModel :modal-active="modalActive"
            @close-modal="toggleModal">
                <div class="text-black">
                    <h1 class="text-2xl mb-1">关于:</h1>
                    <p class="mb-4">
                        此应用允许您查看您所选择地点的当前以及未来的天气
                    </p>
                    <h2 class="text-2xl">如何使用:</h2>
                    <ol class="list-decimal list-inside mb-4">
                        <li>在搜索框中输入您所在城市的名字</li>
                        <li>在搜索结果中选择对应城市,则会跳转至指定结果页面</li>
                        <li>通过点击"+"按钮,则可完成城市天气信息的添加,随后可在主页进行查看</li>
                    </ol>
                    <h2 class="text-2xl">如何删除城市信息:</h2>
                    <p class="mb-4">
                        如果你不想长期关注一个城市的信息,在主页底部有对应删除操作的按钮
                    </p>
                </div>
            </BaseModel>
        </nav>
    </header>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import BaseModel from './BaseModel.vue';
import { uid } from 'uid';

const route = useRoute();
const router = useRouter();

const modalActive = ref(null);
const toggleModal = () => {
    modalActive.value = !modalActive.value;
};

const savedCities = ref([]);
const addCity = () => {
    if (localStorage.getItem('savedCities')) {
        savedCities.value = JSON.parse(
            localStorage.getItem('savedCities')
        );
    }

    // 判断当前地区是否存在
        // 存在则直接中断函数
    // for (let index = 0; index < savedCities.length; index++) {
    //     const place = savedCities[index];
    //     if (route.query.place === place) {
    //         continue;
    //     }
    // }

    const locationObj = {
        id: uid(),
        place: route.params.place,
        place_name: route.params.place_name,
        coords: {
            lon: route.query.lon,
            lat: route.query.lat,
        },
    };

    savedCities.value.push(locationObj);
    localStorage.setItem(
        'savedCities', JSON.stringify(savedCities.value)
    );

    let query = Object.assign({}, route.query);
    delete query.preview;

    query.id = locationObj.id;

    router.replace({ query });
};
</script>