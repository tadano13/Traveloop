import { Search, Heart, MessageCircle, Share2, Plus } from 'lucide-react';

const posts = [
  {
    id: 1,
    user: 'Sarah Miller',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800',
    location: 'Bali, Indonesia',
    content: 'Just reached the summit of Mount Batur for sunrise! Absolutely breathtaking view. Highly recommend the morning trek. 🌋✨',
    likes: 1204,
    comments: 85,
    tags: ['Adventure', 'Nature', 'Travel']
  },
  {
    id: 2,
    user: 'Alex Chen',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
    location: 'Tokyo, Japan',
    content: 'Found this hidden sushi spot in Shinjuku. The fatty tuna was out of this world! 🍣🥢 #TokyoEats',
    likes: 850,
    comments: 42,
    tags: ['Food', 'CityLife', 'Japan']
  }
];

export default function Community() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Community Header */}
      <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold brand">Community</h1>
          <div className="relative flex-1 mx-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search posts..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm outline-none"
            />
          </div>
          <button className="p-2 bg-blue-50 text-blue-600 rounded-full">
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-8">
        {posts.map((post) => (
          <div key={post.id} className="card overflow-hidden">
            {/* Post User Info */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full object-cover border" />
                <div>
                  <h3 className="font-bold text-sm">{post.user}</h3>
                  <p className="text-xs text-gray-500">{post.location}</p>
                </div>
              </div>
              <button className="text-gray-400">•••</button>
            </div>

            {/* Post Image */}
            <div className="relative aspect-video">
              <img src={post.image} alt="Post content" className="w-full h-full object-cover" />
            </div>

            {/* Post Actions */}
            <div className="p-4">
              <div className="flex items-center gap-6 mb-4">
                <button className="flex items-center gap-1.5 text-gray-600 hover:text-red-500 transition-colors">
                  <Heart className="w-6 h-6" />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-gray-600 hover:text-blue-500 transition-colors">
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-sm font-medium">{post.comments}</span>
                </button>
                <button className="text-gray-600 ml-auto">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              {/* Tags */}
              <div className="flex gap-2 mb-3">
                {post.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                    #{tag}
                  </span>
                ))}
              </div>

              <p className="text-sm text-gray-800 leading-relaxed">
                <span className="font-bold mr-2">{post.user}</span>
                {post.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
