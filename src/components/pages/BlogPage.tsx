import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ArrowRight, User as UserIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BlogPost } from '../../types';

interface BlogPageProps {
  onSelectPost: (postId: string) => void;
  selectedPostId?: string | null;
  onBackToList: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  onSelectPost,
  selectedPostId,
  onBackToList
}) => {
  const { blogPosts } = useApp();

  const selectedPost = selectedPostId ? blogPosts.find(b => b.id === selectedPostId) : null;

  // If viewing single post detail
  if (selectedPost) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] py-16 px-4 sm:px-6 lg:px-8">
        <article className="max-w-3xl mx-auto space-y-8">
          <button
            onClick={onBackToList}
            className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white uppercase tracking-wider"
          >
            ← Tüm Makalelere Dön
          </button>

          <div>
            <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-wider block mb-2">
              {selectedPost.category}
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
              {selectedPost.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-neutral-400 mt-4 pb-6 border-b border-neutral-800">
              <span className="flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-[#FF5A1F]" />
                {selectedPost.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {selectedPost.publishDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {selectedPost.readTime}
              </span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden aspect-video bg-neutral-900 border border-neutral-800">
            <img
              src={selectedPost.coverImage}
              alt={selectedPost.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-neutral-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-normal">
            {selectedPost.content}
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 mt-12 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white text-sm">Sorularınız mı var?</h4>
              <p className="text-xs text-neutral-400">Kadir Hoca ile birebir koçluk planını başlatın.</p>
            </div>
            <button
              onClick={onBackToList}
              className="px-5 py-2.5 bg-[#FF5A1F] text-white text-xs font-bold uppercase rounded-lg hover:bg-[#e04e18]"
            >
              Koçluk Al
            </button>
          </div>
        </article>
      </div>
    );
  }

  // Articles List
  return (
    <div className="min-h-screen bg-[#0A0A0A] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5A1F] uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            <span>KADIRFIT BİLİMSEL BLOG</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-black text-white uppercase tracking-tight">
            ANTRENMAN & <span className="text-[#FF5A1F]">BESLENME REHBERİ</span>
          </h1>
          <p className="text-neutral-400 text-sm">
            Popüler fitness mitlerinden uzak, bilimsel temelli makaleler ve araştırmalar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post.id)}
              className="rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all overflow-hidden cursor-pointer flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-black">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-2">
                    <span className="text-[#FF5A1F] font-bold uppercase">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white uppercase leading-snug group-hover:text-[#FF5A1F] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between text-xs font-bold text-[#FF5A1F] border-t border-neutral-800/80 pt-4">
                <span>Devamını Oku</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
