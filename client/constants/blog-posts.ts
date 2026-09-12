import type { BlogPost } from "@/types/blog";

/**
 * The first four posts are adapted from the real articles published on Ishaani
 * Dental Clinic's own site (by Dr. Raghavendra S Medikeri) — lightly reformatted
 * for this layout, content preserved. The remaining posts are original articles
 * written for this site, attributed to the clinic team rather than an individual
 * doctor since they weren't authored by either.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    id: "missing-teeth-replacement",
    slug: "replacing-missing-teeth-implants-bridges-dentures",
    title: "Exploring Advanced Strategies for the Effective Replacement of Missing Teeth",
    excerpt:
      "Missing teeth can significantly impact one's quality of life, affecting both oral health and self-esteem. Here's how modern dentistry solves it.",
    image: "/images/services/implants.jpg",
    category: "Treatment",
    date: "2026-02-26",
    readTime: "4 min read",
    author: "Dr. Raghavendra S Medikeri",
    sections: [
      {
        paragraphs: [
          "Missing teeth can significantly impact one's quality of life, affecting both oral health and self-esteem. When a tooth is lost, it's not just a gap in the smile; it can lead to a decline in overall health that many people don't consider. Fortunately, advancements in dental technology are making it easier to replace missing teeth, allowing individuals to regain comfort and function.",
        ],
      },
      {
        heading: "Understanding the Importance of Tooth Replacement",
        paragraphs: [
          "Tooth loss can lead to several oral health issues. When teeth are missing, adjacent teeth can shift into the gap, altering the bite and leading to further tooth loss. This can cause speech difficulties and make it hard to chew food properly, affecting nutrition — and the aesthetic impact can cause social withdrawal and reduced self-confidence.",
          "By addressing missing teeth through effective replacement strategies, individuals can avoid these complications while enhancing their oral health and self-image.",
        ],
      },
      {
        heading: "Dental Implants: The Gold Standard",
        paragraphs: [
          "Dental implants involve inserting a titanium post into the jawbone, serving as a root for a replacement tooth. Once placed, the implant integrates with the jawbone in a process called osseointegration, which can take 3 to 6 months and provides a strong, stable foundation for artificial teeth.",
        ],
        bullets: [
          "Longevity — with proper care, dental implants can last well over a decade",
          "Preservation of jawbone — implants stimulate the bone, helping prevent the deterioration that follows tooth loss",
          "Natural appearance — crowns attached to implants are nearly indistinguishable from surrounding teeth",
          "Enhanced functionality — unlike dentures, implants allow for seamless eating and speaking",
        ],
      },
      {
        heading: "Fixed Bridges: A Practical Option",
        paragraphs: [
          "A fixed bridge consists of two or more crowns placed on adjacent healthy teeth, with a false tooth anchored in between. The process usually requires only two visits, providing a solid restoration that improves both function and aesthetics — though bridges depend on the health of the supporting teeth and don't prevent long-term bone loss in the jaw.",
        ],
      },
      {
        heading: "Removable Dentures: A Versatile Solution",
        paragraphs: [
          "Removable dentures remain a traditional approach to tooth replacement, with full and partial options depending on the extent of tooth loss. They're generally more affordable and easier to adjust, though some patients find them less secure than implants and may need periodic replacement as the mouth changes shape over time.",
        ],
      },
      {
        heading: "Exploring Advanced Dental Technologies",
        bullets: [
          "3D imaging (CBCT) allows precise planning of implant or bridge placement",
          "Laser dentistry is used for gum reshaping and tooth preparation, often with less discomfort",
          "Digital impressions replace messy molds with a faster, more accurate process",
        ],
      },
      {
        heading: "Finding the Right Solution",
        paragraphs: [
          "Navigating the journey to replace missing teeth offers several effective solutions tailored to individual needs. It's crucial to consult with a dental professional to identify which option aligns best with your specific dental health and lifestyle.",
        ],
      },
    ],
  },
  {
    id: "tooth-malalignment",
    slug: "understanding-tooth-malalignment-orthodontic-solutions",
    title: "Understanding Tooth Malalignment: A Guide to Orthodontic Solutions",
    excerpt:
      "Tooth malalignment is a common dental issue that affects many people worldwide. Here's what causes it, and how modern orthodontics can fix it.",
    image: "/images/services/orthodontics.jpg",
    category: "Orthodontics",
    date: "2026-02-26",
    readTime: "3 min read",
    author: "Dr. Raghavendra S Medikeri",
    sections: [
      {
        heading: "What Is Tooth Malalignment?",
        paragraphs: [
          "Tooth malalignment describes teeth that are not in their ideal position — crooked, crowded, spaced too far apart, or overlapping. It can also involve bite problems, where the upper and lower teeth don't fit together properly.",
        ],
        bullets: [
          "Crowding — insufficient jaw space for all teeth to fit properly",
          "Spacing — gaps between teeth",
          "Overbite — upper front teeth overlap the lower teeth excessively",
          "Underbite — lower teeth extend beyond the upper teeth",
          "Crossbite — some upper teeth sit inside the lower teeth when biting",
          "Open bite — front teeth don't touch when biting down",
        ],
      },
      {
        heading: "Causes of Tooth Malalignment",
        bullets: [
          "Genetics — family history plays a significant role in tooth positioning",
          "Jaw size and shape — a small jaw can cause crowding; a larger one can lead to spacing",
          "Early loss of baby teeth, which can cause permanent teeth to grow incorrectly",
          "Prolonged thumb sucking or pacifier use",
          "Injuries that shift teeth, or untreated cavities and gum disease",
        ],
      },
      {
        heading: "Problems Caused by Malalignment",
        paragraphs: [
          "Crowded or crooked teeth create tight spaces that are hard to clean with brushing and flossing, increasing the risk of decay and gum disease. Improper bite alignment can also strain jaw muscles and joints, leading to jaw pain, clicking, headaches, and uneven wear on the teeth themselves.",
        ],
      },
      {
        heading: "How to Fix It",
        bullets: [
          "Braces — the gold standard for complex movements using brackets and wires",
          "Clear aligners — removable, discreet trays for mild to moderate cases",
          "Retainers — used to maintain position or correct very minor shifts",
          "Surgery or extraction — reserved for severe crowding or skeletal jaw issues",
        ],
      },
      {
        heading: "Early Intervention Matters",
        paragraphs: [
          "Children benefit from early orthodontic evaluation — most orthodontists recommend a first check-up by age 7 to catch jaw growth issues before they become permanent.",
          "Tooth malalignment extends beyond cosmetic concerns — it affects overall oral health and quality of life. Early diagnosis and professional treatment improve outcomes and reduce complications.",
        ],
      },
    ],
  },
  {
    id: "preventing-cavities",
    slug: "preventing-tooth-cavities-expert-dental-tips",
    title: "Preventing Tooth Cavities: Expert Dental Tips for a Healthy Smile",
    excerpt:
      "If not treated early, cavities can cause pain, sensitivity, infection, and eventual tooth loss. Here's how to stop them before they start.",
    image: "/images/services/checkup.jpg",
    category: "Oral Health",
    date: "2026-02-16",
    readTime: "2 min read",
    author: "Dr. Raghavendra S Medikeri",
    sections: [
      {
        heading: "What Are Tooth Cavities?",
        paragraphs: [
          "Tooth cavities, also known as dental caries, develop when bacteria in the mouth produce acids that damage tooth enamel. Left untreated, they can cause pain, sensitivity, infection, and eventual tooth loss.",
        ],
      },
      {
        heading: "Daily Oral Hygiene Tips to Prevent Cavities",
        bullets: [
          "Brush for 2 minutes, twice daily, with fluoride toothpaste and a soft-bristled brush",
          "Replace your toothbrush every 3–4 months",
          "Floss gently once a day to remove plaque between teeth",
          "Use a fluoride mouthwash to strengthen enamel and reduce cavity-causing bacteria",
        ],
      },
      {
        heading: "Diet Tips to Prevent Tooth Decay",
        bullets: [
          "Limit sugary and acidic foods and drinks, and avoid frequent snacking",
          "Choose water or milk over soft drinks",
          "Eat a balanced diet including dairy, leafy greens, nuts, seeds, and fish",
          "Drink plenty of water to wash away food particles and support saliva production",
        ],
      },
      {
        heading: "The Importance of Regular Check-Ups",
        paragraphs: [
          "Visit your dentist every six months. Professional cleaning removes plaque and tartar that brushing alone can't, and early detection prevents small issues from becoming serious ones — ask about fluoride treatments and dental sealants for extra protection.",
        ],
      },
      {
        heading: "The 2-2-2 Rule for Healthy Teeth",
        bullets: [
          "Brush for 2 minutes",
          "Brush twice daily",
          "Visit your dentist every 6 months",
        ],
      },
      {
        heading: "Prevention Is Better Than Cure",
        paragraphs: [
          "Preventing cavities isn't just about avoiding pain or dental bills — it's about maintaining your overall health and confidence. Consistent oral hygiene, a healthy diet, and regular dental visits go a long way toward strong, cavity-free teeth.",
        ],
      },
    ],
  },
  {
    id: "rct-pain-relief",
    slug: "effective-rct-pain-relief-treatment-options",
    title: "Effective RCT Pain Relief Treatment Options",
    excerpt:
      "Root Canal Treatment (RCT) is a common dental procedure designed to save a tooth that is badly decayed or infected — and it's far more comfortable than its reputation suggests.",
    image: "/images/services/root-canal.jpg",
    category: "Treatment",
    date: "2026-01-12",
    readTime: "4 min read",
    author: "Dr. Raghavendra S Medikeri",
    sections: [
      {
        paragraphs: [
          "Root Canal Treatment (RCT) is a common dental procedure designed to save a tooth that is badly decayed or infected. Many people experience severe tooth pain and sensitivity beforehand, which can significantly affect daily life. Modern techniques make RCT pain relief both effective and comfortable.",
        ],
      },
      {
        heading: "Understanding RCT Pain Relief",
        paragraphs: [
          "Pain is often the primary reason patients seek root canal treatment, usually arising from inflammation or infection inside the tooth's pulp. The goal of treatment is to remove the infected pulp, clean the root canals, and seal them to prevent further infection.",
        ],
        bullets: [
          "Local anesthesia ensures the procedure itself is painless",
          "Digital X-rays help visualize the root canals accurately",
          "Rotary instruments allow faster, more precise cleaning",
          "Biocompatible filling materials reduce the risk of reaction",
          "Microscopic magnification enhances precision throughout",
        ],
      },
      {
        heading: "Common Treatment Approaches",
        paragraphs: [
          "Traditional root canal treatment removes the infected pulp, cleans and shapes the canals, then fills them with a rubber-like material called gutta-percha — a crown is usually placed afterward to protect the tooth. Laser-assisted treatment can disinfect canals more thoroughly and support faster healing, while some cases can be completed in a single visit with modern equipment. If a previous root canal fails, retreatment involves removing the old filling material and resealing the canals.",
        ],
      },
      {
        heading: "Is RCT Safe?",
        bullets: [
          "Preserves the natural tooth structure — always preferable to extraction",
          "Prevents the spread of infection to surrounding tissue",
          "Restores normal function for many years",
          "Complications are rare and manageable with modern techniques",
        ],
      },
      {
        heading: "Tips for Post-RCT Care",
        bullets: [
          "Avoid chewing on the treated tooth until the permanent restoration is placed",
          "Maintain good oral hygiene — brush twice daily and floss gently",
          "Take prescribed medication as directed, and use cold compresses if swelling occurs",
          "Avoid very hot or cold foods for a few days",
          "Attend follow-up appointments to place the permanent crown or filling",
        ],
      },
      {
        heading: "Advanced Technologies in Endodontics",
        bullets: [
          "3D imaging (CBCT) for precise treatment planning",
          "Endodontic microscopes for thorough cleaning",
          "Bioceramic sealers with better sealing properties",
        ],
      },
      {
        paragraphs: [
          "With modern technology and skilled care, patients can expect effective pain relief and long-term tooth preservation. Always consult a qualified dentist to discuss the best treatment plan for your specific case.",
        ],
      },
    ],
  },
  {
    id: "teeth-whitening-guide",
    slug: "teeth-whitening-complete-guide-to-a-brighter-smile",
    title: "Teeth Whitening: A Complete Guide to a Brighter Smile",
    excerpt:
      "Coffee, tea, and time all take a toll on your smile. Here's what actually works when it comes to safely brightening your teeth.",
    image: "/images/services/cosmetic.jpg",
    category: "Cosmetic",
    date: "2026-04-10",
    readTime: "4 min read",
    author: "Ishaani Dental Team",
    sections: [
      {
        paragraphs: [
          "A bright, even smile is one of the most requested cosmetic dental treatments — and for good reason. Whitening is quick, non-invasive, and can make a noticeable difference in how a smile looks and feels. But not all whitening is created equal, and understanding your options helps you get safer, longer-lasting results.",
        ],
      },
      {
        heading: "How Teeth Get Stained",
        bullets: [
          "Coffee, tea, red wine, and dark sodas",
          "Tobacco use",
          "Natural aging, as enamel thins and the yellower dentin beneath shows through",
          "Certain medications taken during childhood tooth development",
          "Inconsistent brushing and flossing, which lets surface stains build up",
        ],
      },
      {
        heading: "In-Office vs At-Home Whitening",
        paragraphs: [
          "In-office whitening uses a stronger, professionally-applied bleaching gel and is typically completed in a single visit, with gums protected throughout. At-home kits — whether custom trays from your dentist or over-the-counter strips — take longer to show results but can be a lower-cost way to maintain your shade between professional treatments.",
          "Dentist-supervised whitening is generally the safer route: concentration, application time, and your gum health are all monitored, reducing the risk of sensitivity or uneven results.",
        ],
      },
      {
        heading: "What to Expect During Treatment",
        paragraphs: [
          "Before whitening, your dentist will check for cavities or gum issues that need addressing first, since whitening gel can irritate compromised areas. During an in-office session, a protective barrier shields your gums while the whitening agent is applied and activated, often in a few short cycles.",
        ],
      },
      {
        heading: "Aftercare Tips to Maintain Your Results",
        bullets: [
          "Avoid deeply pigmented foods and drinks for the first 24–48 hours",
          "Use a straw for coffee, tea, or dark drinks going forward",
          "Keep up with brushing, flossing, and regular cleanings",
          "Touch-up treatments every so often help maintain your shade",
        ],
      },
      {
        heading: "Is Whitening Right for You?",
        paragraphs: [
          "Whitening works best on healthy, natural enamel — it won't change the color of existing crowns, veneers, or fillings, which is worth discussing with your dentist if you have visible restorations. Sensitivity is the most common side effect and is usually mild and temporary.",
          "A consultation is the best way to find out which approach — in-office, at-home, or a combination — will get you the brightest result safely.",
        ],
      },
    ],
  },
  {
    id: "childrens-dental-care",
    slug: "a-parents-guide-to-childrens-dental-care",
    title: "A Parent's Guide to Children's Dental Care",
    excerpt:
      "From the first tooth to the first checkup, here's how to set your child up for a lifetime of healthy smiles.",
    image: "/images/services/pediatric.jpg",
    category: "Pediatric",
    date: "2026-05-02",
    readTime: "5 min read",
    author: "Ishaani Dental Team",
    sections: [
      {
        paragraphs: [
          "Good dental habits started early can prevent a lifetime of avoidable problems. Children's mouths change quickly, and knowing what to expect — and when to act — makes it much easier to keep small issues from becoming bigger ones.",
        ],
      },
      {
        heading: "When to Start",
        paragraphs: [
          "Most dentists recommend a first dental visit by your child's first birthday, or within six months of their first tooth erupting — whichever comes first. Early visits are short and low-pressure, focused on getting your child comfortable with the chair and catching any early decay.",
        ],
      },
      {
        heading: "Building Healthy Habits Early",
        bullets: [
          "Brush twice daily with a pea-sized amount of fluoride toothpaste once teeth appear",
          "Supervise brushing until your child can reliably do it well on their own, usually around age 6–7",
          "Start flossing as soon as two teeth touch",
          "Limit sugary snacks and juice, especially between meals",
          "Avoid putting a child to bed with a bottle of milk or juice",
        ],
      },
      {
        heading: "Cavity Sealants",
        paragraphs: [
          "Once permanent molars come in — typically between ages 6 and 12 — sealants can be applied in minutes to shield the deep grooves where cavities most often start. It's a quick, painless way to meaningfully reduce cavity risk for years.",
        ],
      },
      {
        heading: "Common Concerns",
        bullets: [
          "Thumb sucking: usually harmless early on, but prolonged habits past age 4–5 can affect tooth alignment",
          "Teething: gentle gum massage and chilled (not frozen) teething rings can help with discomfort",
          "Losing baby teeth early: due to decay or injury, this can affect how permanent teeth come in and may need a spacer",
        ],
      },
      {
        heading: "Making Dental Visits Positive",
        paragraphs: [
          "How a child feels about the dentist early on tends to stick. Keep the language light, avoid words like 'pain' or 'shot,' and consider a practice that's experienced with treating children specifically — a calm first few visits go a long way toward a lifetime of good dental habits.",
        ],
      },
    ],
  },
  {
    id: "gum-disease-prevention",
    slug: "gum-disease-warning-signs-and-prevention",
    title: "Gum Disease: Warning Signs and Prevention",
    excerpt:
      "Bleeding gums are not normal. Here's how to catch gum disease early — and the daily habits that keep it from progressing.",
    image: "/images/blog/gum-disease.jpg",
    category: "Oral Health",
    date: "2026-06-14",
    readTime: "4 min read",
    author: "Ishaani Dental Team",
    sections: [
      {
        paragraphs: [
          "Gum disease is one of the most common — and most overlooked — dental problems, largely because its early stage often causes no pain at all. Catching it early makes treatment far simpler and keeps it from progressing to something more serious.",
        ],
      },
      {
        heading: "Warning Signs to Watch For",
        bullets: [
          "Gums that bleed during brushing or flossing",
          "Redness, swelling, or tenderness along the gumline",
          "Persistent bad breath that doesn't go away with brushing",
          "Gums that appear to be pulling away from the teeth",
          "Loose or shifting teeth",
          "Pain while chewing",
        ],
      },
      {
        heading: "What Causes Gum Disease",
        bullets: [
          "Plaque buildup left along the gumline, which hardens into tartar",
          "Smoking or tobacco use",
          "Inconsistent brushing and flossing",
          "Diabetes and certain other health conditions",
          "Hormonal changes, including pregnancy",
          "Genetic predisposition",
        ],
      },
      {
        heading: "The Two Stages of Gum Disease",
        paragraphs: [
          "Gingivitis is the early, reversible stage — gums may be red, swollen, or bleed easily, but the underlying bone and tissue are still intact. Left untreated, gingivitis can progress to periodontitis, where the infection moves below the gumline, damaging the tissue and bone that hold teeth in place. Periodontitis can ultimately lead to tooth loss and is much harder to fully reverse.",
        ],
      },
      {
        heading: "Prevention Tips",
        bullets: [
          "Brush twice daily and floss once a day, focusing on the gumline",
          "Use an antimicrobial mouthwash if recommended by your dentist",
          "Don't skip your six-month cleaning — it removes tartar brushing can't",
          "Quit smoking, which significantly raises the risk of gum disease",
          "Manage underlying conditions like diabetes with your physician",
        ],
      },
      {
        heading: "Treatment Options",
        paragraphs: [
          "Gingivitis often resolves with a professional cleaning and improved home care. More advanced periodontitis may require deep cleaning (scaling and root planing) to clean below the gumline, and in severe cases, gum surgery or bone grafting to repair the damage. The earlier it's caught, the simpler the treatment.",
        ],
      },
    ],
  },
  {
    id: "foods-healthy-teeth",
    slug: "foods-that-strengthen-your-teeth",
    title: "Foods That Strengthen Your Teeth (and Foods to Avoid)",
    excerpt:
      "What you eat matters as much as how you brush. A simple guide to the foods that protect your enamel — and the ones that wear it down.",
    image: "/images/blog/foods-teeth.jpg",
    category: "Nutrition",
    date: "2026-07-01",
    readTime: "3 min read",
    author: "Ishaani Dental Team",
    sections: [
      {
        paragraphs: [
          "Diet plays a bigger role in oral health than most people realize. Some foods actively support strong enamel and healthy gums, while others feed the bacteria that cause decay. A few mindful swaps can make a real difference over time.",
        ],
      },
      {
        heading: "Foods That Support Strong Teeth",
        bullets: [
          "Dairy — milk, cheese, and yogurt provide calcium and phosphate that help remineralize enamel",
          "Leafy greens — rich in calcium and folic acid, with the added benefit of being low in sugar",
          "Crunchy fruits and vegetables — apples, carrots, and celery help clean teeth and stimulate saliva",
          "Nuts and seeds — provide minerals and protein with minimal sugar",
          "Fatty fish — a good source of vitamin D, which helps the body absorb calcium",
          "Water — especially fluoridated water, which rinses away food particles and supports saliva flow",
        ],
      },
      {
        heading: "Foods and Drinks to Limit",
        bullets: [
          "Sugary snacks and candy, especially sticky or chewy varieties that cling to teeth",
          "Sodas and sports drinks — both sugar and acid content can erode enamel",
          "Excess citrus or other highly acidic foods",
          "Starchy snacks like chips, which can get trapped between teeth and break down into sugars",
        ],
      },
      {
        heading: "Timing Matters Too",
        paragraphs: [
          "How often you eat matters as much as what you eat. Frequent snacking throughout the day keeps your mouth in an acidic state for longer, giving bacteria more opportunity to damage enamel. Eating sugary or acidic foods with a meal — rather than alone as a snack — and rinsing with water afterward helps minimize the impact.",
        ],
      },
      {
        heading: "Simple Swaps",
        bullets: [
          "Swap soda for sparkling water or plain water",
          "Swap candy for a piece of fruit or a handful of nuts",
          "Swap sipping coffee all day for one sitting, followed by water",
        ],
      },
    ],
  },
];
