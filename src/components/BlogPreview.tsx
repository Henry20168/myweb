"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";
import { Dict } from "@/i18n/dictionaries";

export default function BlogPreview({ dict }: { dict: Dict["blog"] }) {
  const [selectedPost, setSelectedPost] = useState<typeof POSTS[0] | null>(null);

  if (!dict) return null;

  const POSTS = [
    {
      title: dict.post1Title,
      desc: dict.post1Desc,
      image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&q=80&w=800",
      category: dict.post1Category,
      content: dict.post1Content
    },
    {
      title: dict.post2Title,
      desc: dict.post2Desc,
      image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=800",
      category: dict.post2Category,
      content: dict.post2Content
    },
    {
      title: dict.post3Title,
      desc: dict.post3Desc,
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800",
      category: dict.post3Category,
      content: dict.post3Content
    },
  ];

  return (
    <section className="py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4" suppressHydrationWarning>
        <div className="space-y-3" suppressHydrationWarning>
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight">{dict.title}</h2>
          <p className="text-gray-500 max-w-xl">
            {dict.description}
          </p>
        </div>
        <Link href="/" className="text-red-600 font-bold hover:underline">
          {dict.viewAll} →
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {POSTS.map((post, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-4">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-gray-900 uppercase tracking-wider">
                {post.category}
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-2">
              {post.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {post.desc}
            </p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-900 hover:bg-red-600 hover:text-white transition-all shadow-lg"
              >
                <X size={20} />
              </button>
              
              <div className="relative h-64 sm:h-80">
                <Image
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="inline-block px-3 py-1 rounded-full bg-red-600 text-[10px] font-bold text-white uppercase tracking-widest mb-3">
                    {selectedPost.category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">{selectedPost.title}</h2>
                </div>
              </div>
              
              <div className="p-8">
                <p className="text-gray-600 leading-relaxed text-lg italic mb-6">
                  &quot;{selectedPost.desc}&quot;
                </p>
                <div className="prose prose-sm sm:prose-base text-gray-500 max-w-none">
                  {selectedPost.content}
                </div>
                <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                      AC
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">aalikouch car</div>
                      <div className="text-xs text-gray-400">Travel Expert</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-black transition-all"
                  >
                    Close Guide
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
