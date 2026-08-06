import re
from collections import Counter

TECH_TERMS = {
    "python", "java", "javascript", "c++", "c#", "ruby", "php", "swift", "kotlin", "go",
    "rust", "typescript", "html", "css", "sql", "nosql", "react", "angular", "vue", "node.js",
    "express", "django", "flask", "spring", "fastapi", "aws", "azure", "gcp", "docker",
    "kubernetes", "jenkins", "git", "github", "gitlab", "agile", "scrum", "kanban",
    "machine learning", "deep learning", "nlp", "computer vision", "tensorflow", "pytorch",
    "pandas", "numpy", "scikit-learn", "data engineering", "devops", "ci/cd", "linux",
    "bash", "powershell", "terraform", "ansible", "puppet", "chef", "graphql", "rest",
    "microservices", "serverless", "mysql", "postgresql", "mongodb", "redis", "elasticsearch"
}

STOP_WORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any",
    "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below",
    "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did",
    "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few",
    "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having",
    "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him",
    "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into",
    "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't",
    "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other",
    "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she",
    "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that",
    "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's",
    "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through",
    "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll",
    "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where",
    "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't",
    "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours",
    "yourself", "yourselves"
}

def extract_keywords(text: str) -> list[dict]:
    words = re.findall(r'\b[a-zA-Z\.+#-]+\b', text.lower())
    filtered_words = [w for w in words if w not in STOP_WORDS and len(w) > 1]
    
    counts = Counter(filtered_words)
    
    # Give weight to tech terms
    keywords = []
    for word, count in counts.items():
        if word in TECH_TERMS or count > 2:
            keywords.append({"keyword": word, "count": count})
            
    return sorted(keywords, key=lambda x: x["count"], reverse=True)

def match_keywords(resume_text: str, jd_text: str) -> dict:
    if not jd_text:
        return {"matched": [], "missing": [], "match_score": 0}
        
    resume_words = set(w for w in re.findall(r'\b[a-zA-Z\.+#-]+\b', resume_text.lower()) if w not in STOP_WORDS)
    jd_words = [w for w in re.findall(r'\b[a-zA-Z\.+#-]+\b', jd_text.lower()) if w not in STOP_WORDS]
    
    jd_counts = Counter(jd_words)
    important_jd_keywords = [w for w, c in jd_counts.items() if w in TECH_TERMS or c >= 2]
    
    matched = []
    missing = []
    
    for kw in important_jd_keywords:
        if kw in resume_words:
            matched.append({"keyword": kw, "count": resume_text.lower().count(kw)})
        else:
            importance = "high" if kw in TECH_TERMS else "medium"
            missing.append({"keyword": kw, "importance": importance})
            
    total_important = len(important_jd_keywords)
    match_score = int((len(matched) / total_important * 100)) if total_important > 0 else 0
    
    return {
        "matched": matched,
        "missing": missing,
        "match_score": match_score
    }
