import React, {useEffect,useState} from "react";
import {Link} from "react-router-dom";
"use client";
import React, { useEffect, useRef, useState } from "react";

export default function MedicalUpPage() {
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.dataset.id;
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [id]: true }));
            observer.unobserve(entry.target); // stop observing once visible
          }
        });
      },
      { threshold: 0.2 }
    );

    Object.values(sectionRefs.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="overflow-hidden">
      {/* Section Hero */}
      <section
        ref={(el) => (sectionRefs.current["hero"] = el)}
        data-id="hero"
        className={`transition-all duration-1000 ease-out ${
          visibleSections["hero"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="h-screen bg-blue-200 flex justify-center items-center">
          <h1 className="text-4xl font-bold">Hero Section</h1>
        </div>
      </section>

      {/* Section Why Us */}
      <section
        ref={(el) => (sectionRefs.current["why"] = el)}
        data-id="why"
        className={`transition-all duration-1000 ease-out ${
          visibleSections["why"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="min-h-screen bg-green-200 flex justify-center items-center">
          <h2 className="text-3xl font-semibold">Kenapa Memilih Kami</h2>
        </div>
      </section>

      {/* Section Layanan */}
      <section
        ref={(el) => (sectionRefs.current["layanan"] = el)}
        data-id="layanan"
        className={`transition-all duration-1000 ease-out ${
          visibleSections["layanan"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="min-h-screen bg-yellow-200 flex justify-center items-center">
          <h2 className="text-3xl font-semibold">Layanan Kami</h2>
        </div>
      </section>

      {/* Section Tenaga Medis */}
      <section
        ref={(el) => (sectionRefs.current["tenaga"] = el)}
        data-id="tenaga"
        className={`transition-all duration-1000 ease-out ${
          visibleSections["tenaga"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="min-h-screen bg-pink-200 flex justify-center items-center">
          <h2 className="text-3xl font-semibold">Tenaga Medis Profesional</h2>
        </div>
      </section>

      {/* Section Jam Buka */}
      <section
        ref={(el) => (sectionRefs.current["jam"] = el)}
        data-id="jam"
        className={`transition-all duration-1000 ease-out ${
          visibleSections["jam"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="min-h-screen bg-purple-200 flex justify-center items-center">
          <h2 className="text-3xl font-semibold">Jam Buka Klinik</h2>
        </div>
      </section>

      {/* Section Testimoni */}
      <section
        ref={(el) => (sectionRefs.current["testimoni"] = el)}
        data-id="testimoni"
        className={`transition-all duration-1000 ease-out ${
          visibleSections["testimoni"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="min-h-screen bg-gray-200 flex justify-center items-center">
          <h2 className="text-3xl font-semibold">Testimoni Pasien</h2>
        </div>
      </section>
    </main>
  );
}

