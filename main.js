import axios from 'axios';



const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const searchInput = document.getElementById('searchInput');

let videos = []; 


async function fetchVideos(query = '') {
    const options = {
        method: 'GET',
        url: 'https://youtube-v31.p.rapidapi.com/search',
        params: {
            part: 'id,snippet',
            type: 'video',
            maxResults: '50',
            q: query
        },
        headers: {
            'x-rapidapi-key': '4efc0bc1c3msh00850095541e7eep187032jsn90ffebdd2ffc',
            'x-rapidapi-host': 'youtube-v31.p.rapidapi.com'
        }
    };


    if (!query) {
        options.params.relatedToVideoId = '7ghhRHRP6t4';
    }

    try {
        const response = await axios.request(options);
        videos = response.data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            author: item.snippet.channelTitle,
            thumb: item.snippet.thumbnails.high.url
        }));

        // ВАЖНО: Восстанавливаем разметку сетки, если её стёр плеер
        renderLayout();
        renderVideos(videos);
    } catch (error) {
        console.error("Ошибка API:", error);
    }
}


function renderLayout() {
    mainContent.innerHTML = `
        <div id="categoryContainer" class="flex gap-3 py-3 sticky top-[56px] bg-[#0f0f0f] z-40 overflow-x-auto"></div>
        <div id="videoGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 mt-4"></div>
    `;
}


function renderVideos(data) {
    const grid = document.getElementById('videoGrid');
    if (!grid) return;
    
    grid.innerHTML = data.map((v, i) => `
        <div onclick="openVideoPage(${i})" class="flex flex-col gap-3 cursor-pointer group">
            <div class="relative aspect-video overflow-hidden rounded-xl bg-zinc-800">
                <img src="${v.thumb}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
            </div>
            <div class="flex gap-3">
                <div class="w-9 h-9 shrink-0 bg-zinc-700 rounded-full flex items-center justify-center font-bold text-white text-[10px]">
                    ${v.author ? v.author[0] : 'Y'}
                </div>
                <div>
                    <h3 class="text-[14px] font-bold line-clamp-2 leading-tight text-white">${v.title}</h3>
                    <p class="text-zinc-400 text-xs mt-1">${v.author}</p>
                </div>
            </div>
        </div>
    `).join('');
}


window.openVideoPage = function(index) {
    const video = videos[index];
    if (!video) return;

    window.scrollTo(0, 0);
    mainContent.innerHTML = `
        <div class="flex flex-col lg:flex-row gap-6 p-2 lg:p-6 bg-[#0f0f0f] min-h-screen">
            <div class="flex-1">
                <div class="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                    <iframe class="w-full h-full" src="https://www.youtube.com/embed/${video.id}?autoplay=1" frameborder="0" allowfullscreen></iframe>
                </div>
                <h1 class="text-xl font-bold mt-4 text-white">${video.title}</h1>
                <div class="flex items-center gap-3 mt-4 border-b border-zinc-800 pb-6">
                    <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white">${video.author[0]}</div>
                    <div class="flex-1 text-white">
                        <p class="font-bold">${video.author}</p>
                        <p class="text-zinc-400 text-xs">1.2 млн подписчиков</p>
                    </div>
                    <button class="bg-white text-black px-4 py-2 rounded-full font-medium">Подписаться</button>
                </div>
            </div>
            <div id="sideFeed" class="w-full lg:w-[350px] flex flex-col gap-3"></div>
        </div>
    `;

    document.getElementById('sideFeed').innerHTML = videos.slice(0, 12).map((v, i) => `
        <div onclick="openVideoPage(${i})" class="flex gap-2 cursor-pointer group">
            <img src="${v.thumb}" class="w-32 h-20 object-cover rounded-lg">
            <h4 class="text-xs font-bold text-white line-clamp-2">${v.title}</h4>
        </div>
    `).join('');
};


searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const value = e.target.value.trim();
        fetchVideos(value);
    }
});


menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('w-64');
    sidebar.classList.toggle('w-20');
    mainContent.classList.toggle('ml-64');
    mainContent.classList.toggle('ml-20');
    document.querySelectorAll('.menu-text').forEach(t => t.classList.toggle('hidden'));
});

// ЗАПУСК ПРИ ЗАГРУЗКЕ
fetchVideos();