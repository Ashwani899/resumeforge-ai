import re

ACTION_VERBS = {
    "achieved", "improved", "managed", "created", "resolved", "developed", 
    "implemented", "designed", "led", "increased", "decreased", "saved", 
    "launched", "orchestrated", "spearheaded", "optimized", "streamlined"
}

def analyze(parsed_resume: dict) -> dict:
    sections = parsed_resume.get("sections", {})
    contact = parsed_resume.get("contact", {})
    word_count = parsed_resume.get("word_count", 0)
    
    score = 0
    breakdown = {}
    tips = []
    
    # 1. Contact (10)
    contact_score = 0
    if contact.get("email"): contact_score += 3
    if contact.get("phone"): contact_score += 3
    if contact.get("linkedin"): contact_score += 4
    score += contact_score
    breakdown["contact"] = contact_score
    if contact_score < 10:
        tips.append({"type": "warning", "text": "Add LinkedIn profile for better visibility."})
        
    # 2. Structure (8)
    structure_score = 0
    for sec in ["summary", "experience", "education", "skills"]:
        if sections.get(sec): structure_score += 2
    score += structure_score
    breakdown["structure"] = structure_score
    if structure_score < 8:
        tips.append({"type": "error", "text": "Ensure you have Summary, Experience, Education, and Skills sections."})
        
    # 3. Word Count / Length (5)
    length_score = 5 if 300 <= word_count <= 900 else (2 if word_count > 900 else 1)
    score += length_score
    breakdown["length"] = length_score
    if length_score < 5:
        tips.append({"type": "info", "text": "Optimal length is between 300 and 900 words."})
        
    # 4. Summary (8)
    summary = sections.get("summary", "")
    sum_words = len(summary.split())
    sum_score = 0
    if 30 <= sum_words <= 80: sum_score += 4
    if not re.search(r'\b(I|me|my)\b', summary, re.I): sum_score += 4
    score += sum_score
    breakdown["summary"] = sum_score
    
    # 5. Experience (20)
    exp = sections.get("experience", "")
    exp_score = 0
    if len(exp) > 100: exp_score += 10
    if re.search(r'\d{4}', exp): exp_score += 10 # rough check for dates
    score += exp_score
    breakdown["experience"] = exp_score
    
    # 6. Education (8)
    edu = sections.get("education", "")
    edu_score = 8 if len(edu) > 20 else 0
    score += edu_score
    breakdown["education"] = edu_score
    
    # 7. Skills (15)
    skills = sections.get("skills", "")
    skill_words = len(skills.split(',')) if ',' in skills else len(skills.split())
    skills_score = 15 if skill_words >= 10 else (8 if skill_words >= 5 else 0)
    score += skills_score
    breakdown["skills"] = skills_score
    
    # 8. Formatting (8)
    fmt_score = 8 # simplified
    score += fmt_score
    breakdown["formatting"] = fmt_score
    
    # 9. Action Verbs (10)
    exp_words = set(re.findall(r'\b\w+\b', exp.lower()))
    verb_count = len(exp_words.intersection(ACTION_VERBS))
    verb_score = min(10, verb_count * 2)
    score += verb_score
    breakdown["verbs"] = verb_score
    if verb_score < 10:
        tips.append({"type": "info", "text": "Use more strong action verbs (e.g., optimized, led, achieved)."})
        
    # 10. Impact / Metrics (8)
    metrics_count = len(re.findall(r'\b\d+%\b|\$\d+', exp))
    impact_score = min(8, metrics_count * 2)
    score += impact_score
    breakdown["impact"] = impact_score
    if impact_score < 8:
        tips.append({"type": "warning", "text": "Quantify your achievements with metrics (%, $, numbers)."})

    return {
        "overall": score,
        "breakdown": breakdown,
        "tips": tips
    }
