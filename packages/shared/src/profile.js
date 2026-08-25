/**
 * The participant Personal Profile: section and question definitions.
 *
 * This file is the contract for the whole profile feature. The web app renders
 * its forms from it, the API validates section saves against it, and the
 * database stores answers as (question_key -> JSON value) rows — so changing a
 * section or question here is a seed edit, never a migration.
 *
 * Canon: the section list is the Final Override seed
 * (seed_bundle_final_override_v1.json, 11 sections — resolves ruling R-01);
 * titles, order and plain-language descriptions are verbatim from the seed.
 * The question content inside each section is the FCA intake
 * ("FCA (INTAKE FINAL).docx", Aug 2026) — the Personal Profile IS the intake:
 * one living document, never a set of disconnected forms. FCA_BASELINE stays
 * an internal model term; none of the copy here may say FCA / Baseline /
 * Assessment (see @tmg180/terminology).
 *
 * Shape: each section has `groups` (a titled block of the intake, with its
 * participant-facing framing copy) and a derived flat `questions` array which
 * is what validation reads. Multi options are { value, label } — labels are
 * part of the contract now, so the renderer stays generic.
 *
 * Question types (validation semantics, not rendering):
 *   text      short string
 *   textarea  long string
 *   select    one value from `options`
 *   multi     array of values from `options` (checkbox groups)
 *   toggle    boolean
 *   scale     integer from `min` to `max`
 *   steps     array of { text, done } (goal steps)
 */

/** P1-03: every answer carries a visibility, private by default. */
export const ANSWER_VISIBILITY = {
  PRIVATE: 'participant_private',
  SHARE_WITH_CONSENT: 'share_with_consent',
  SNAPSHOT_ONLY: 'snapshot_only',
};

export const PROFILE_SECTION_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETE: 'complete',
};

const MAX_TEXT = 255;
const MAX_TEXTAREA = 5000;
const MAX_MULTI = 50;
const MAX_STEPS = 20;

const opts = (pairs) => pairs.map(([value, label]) => ({ value, label }));

const EXPLAIN_FURTHER = 'If you would like to explain anything further';

export const PROFILE_SECTIONS = [
  {
    key: 'overview',
    order: 1,
    title: 'Overview',
    description: 'A gentle introduction to your profile and how it belongs to you.',
    intro: [
      'What you are completing here is your Personal Profile. It is about understanding your own life clearly enough that support aligns with what you actually experience.',
      'This is not about exaggerating or proving anything.',
      'For some people, this is straightforward. For others — especially when challenges are hidden, fluctuating, psychosocial, neurological, or fatigue-based — it can be much harder to explain how things affect everyday life. Many people live with patterns they have adapted to for years without ever putting those impacts into words. This profile is designed to help you do that.',
      'Everyone has strengths and challenges. This profile is about seeing you as a whole person. It looks at what is difficult, what supports you, what affects your energy, what matters to you, and where support genuinely makes a difference. It focuses not only on everyday activities, but on quality of life.',
      'You do not need to complete this all at once. It saves automatically and you can come back to it at any time. You can sit with someone you trust while you complete it. You do not need to answer anything you are not ready to answer.',
      'What matters is that what is written here reflects your real experience. Nothing here is fixed. Nothing locks you in. This is simply a starting point.',
    ],
    groups: [
      {
        title: 'Your profile belongs to you',
        intro: [
          'You choose who sees it, who you share it with, whether you update it, and whether you download it. No one can access your profile unless you allow it — though sharing it with your chosen workers will allow your support network to understand your support needs and how you would like them delivered.',
          'Your notes are visible to you at all times. You can read them, contribute to them, add reflections, upload notes from other workers, and choose who has access. Workers will add notes about sessions; you can also add your own perspective.',
          'TMG180 organises and summarises your information over time. It does not replace your voice. It does not make decisions for you. It translates patterns into clear language so you can see how your support is being used, how your needs fluctuate, where improvements are happening, where support remains essential, and how this connects to your goals.',
          'This means that when reassessment time comes, you are not trying to prove your life from memory. You have structured evidence built gradually over time. You remain the one who explains it — but you are not starting from scratch.',
          'Nothing is hidden from you. Nothing is created without visibility. Nothing is shared without your consent.',
        ],
        questions: [
          {
            key: 'documentation_choice',
            type: 'multi',
            label: 'Your Choice',
            helper:
              'The platform works best when documentation is consistent, but participation is still your choice.',
            options: opts([
              ['allow_full_documentation', 'Allow full structured documentation'],
              ['participate_actively', 'Participate actively in adding reflections'],
              ['upload_external_notes', 'Upload external case notes'],
              ['limit_involvement', 'Limit involvement'],
              ['decide_later', 'Decide later'],
            ]),
          },
        ],
      },
    ],
  },
  {
    key: 'about_me',
    order: 2,
    title: 'About Me',
    description: 'What you want people to know about you as a person.',
    groups: [
      {
        title: 'Your Personality Style',
        intro: [
          'This section is about getting to know you. Not in a clinical way — in a real way.',
          'Different people feel comfortable with different types of support. Some people prefer structure and predictability. Others prefer flexibility. Some value independence strongly. Others value connection. There is no right answer here.',
          'Workers on this platform also complete a similar section. This is simply a tool to help you understand what type of personality and communication style you feel most comfortable around. You can choose what is true for you.',
        ],
        questions: [
          {
            key: 'personality_style',
            type: 'multi',
            label: 'What feels true for you',
            options: opts([
              ['value_independence', 'I value independence'],
              ['value_connection', 'I value connection'],
              ['need_predictability', 'I need predictability'],
              ['prefer_flexibility', 'I prefer flexibility'],
              ['creative', 'I am creative'],
              ['practical', 'I am practical'],
              ['reflective', 'I am reflective'],
              ['caring', 'I am caring'],
              ['resilient', 'I am resilient'],
              ['still_figuring_out', 'I am still figuring this out'],
              ['own_words', 'I would rather describe this in my own words'],
            ]),
          },
          {
            key: 'personality_own_words',
            type: 'textarea',
            label: 'In your own words',
            placeholder: 'Describe your personality style in your own words, if you prefer.',
          },
        ],
      },
      {
        title: 'Misconceptions and Past Experiences',
        intro: [
          'Many people can describe a time when they felt misunderstood, misjudged, overestimated, underestimated, or shamed.',
          'In everyday life, people often expect others to behave a certain way, cope the same way, communicate the same way, or move through life at the same pace. That is not realistic. For people living with physical or psychosocial challenges, assumptions can happen more often.',
          'Over time, repeated misunderstandings can affect how safe and comfortable you feel in support relationships. This section is to help you understand your past experiences — not to label you.',
          'If any of the following feel true for you, you can tick them. If none fit, that is also completely fine.',
        ],
        questions: [
          {
            key: 'past_experiences',
            type: 'multi',
            label: 'What feels true for you',
            options: opts([
              ['coping_better_than_am', 'People think I am coping better than I am'],
              ['underestimate_hard', 'People underestimate how hard some things are for me'],
              ['focus_on_struggles', 'People focus too much on what I struggle with'],
              ['strengths_unseen', "People don't see my strengths because I struggle in certain areas"],
              ['misread_communication', 'People misread my communication or behaviour'],
              ['too_sensitive', 'People think I am too sensitive or overreacting'],
              ['emotions_come_strongly', 'When I am overwhelmed, my emotions can come out strongly'],
              ['shut_down_withdraw', 'I may shut down, withdraw, or become tearful or frustrated when stressed'],
              ['distress_as_anger', 'Sometimes my distress comes out as anger or frustration'],
              ['shame_about_reactions', 'I feel shame about how I react sometimes'],
              ['does_not_apply', 'This does not apply to me'],
              ['own_words', 'I would rather explain this in my own words'],
            ]),
          },
          {
            key: 'past_experiences_own_words',
            type: 'textarea',
            label: 'Something not listed here you want to explain in your own words',
          },
        ],
      },
    ],
  },
  {
    key: 'communication',
    order: 3,
    title: 'How I Communicate',
    description: 'How you prefer information to be shared and understood.',
    groups: [
      {
        title: 'What Helps You Feel Respected and Understood',
        intro: [
          'This section is about how you prefer to be treated and communicated with.',
          'Everyone communicates differently. Stress, fatigue, health conditions, trauma, or life experience can all affect how safe or comfortable communication feels.',
          'You know what works for you — even if you have not always been asked. You can choose what feels true for you.',
        ],
        questions: [
          {
            key: 'feel_comfortable_when',
            type: 'multi',
            label: 'I feel most comfortable when',
            options: opts([
              ['listened_not_rushed', 'I am listened to without being rushed'],
              ['believed', 'I am believed'],
              ['taken_seriously', 'My experiences are taken seriously'],
              ['treated_as_equal', 'I am treated as an equal'],
              ['explained_clearly', 'Things are explained clearly'],
              ['time_to_think', 'I have time to think and respond'],
              ['not_judged', 'I am not judged'],
              ['can_change_mind', 'I can change my mind without feeling guilty'],
              ['not_sure_yet', 'I am not sure yet'],
            ]),
          },
          {
            key: 'communication_other',
            type: 'textarea',
            label: 'If there is something important that is not listed, you can write it here',
          },
        ],
      },
    ],
  },
  {
    key: 'what_matters',
    order: 4,
    title: 'What Matters To Me',
    description: 'People, routines, places, interests and values that matter to you.',
    groups: [
      {
        title: 'What Gives Your Life Meaning',
        intro: [
          'These questions are about the things that matter to you — the parts of life that give you comfort, identity, or a sense of purpose.',
          'You do not need to justify any of these. You can choose as many or as few as what you feel is true for you.',
        ],
        questions: [
          {
            key: 'meaning',
            type: 'multi',
            label: 'What matters to you',
            options: opts([
              ['family', 'Family'],
              ['children_caring_roles', 'Children or caring roles'],
              ['friends', 'Friends'],
              ['animals_pets', 'Animals or pets'],
              ['community', 'Community'],
              ['culture_spirituality', 'Culture or spirituality'],
              ['learning', 'Learning'],
              ['work', 'Work or previous work'],
              ['volunteering', 'Volunteering'],
              ['creativity', 'Creativity or making things'],
              ['music', 'Music'],
              ['gaming_online', 'Gaming or online communities'],
              ['outdoors', 'Being outdoors'],
              ['quiet_time_rest', 'Quiet time or rest'],
              ['routine_rhythm', 'Routine and rhythm in my day'],
              ['humour_laughter', 'Humour and laughter'],
              ['personal_projects', 'Personal projects or interests'],
              ['movies', 'Movies'],
              ['reading', 'Reading'],
              ['social_media', 'Social media'],
              ['social_justice', 'Social justice'],
              ['advocacy', 'Advocacy'],
              ['sports', 'Sports'],
              ['spirituality_religion', 'Spirituality or religion'],
              ['something_else', 'Something else important to me'],
            ]),
          },
          {
            key: 'meaning_own_words',
            type: 'textarea',
            label: 'Tell us more',
            placeholder:
              'If you chose sports (which ones?) or something else important to you, you can tell us more here.',
          },
        ],
      },
      {
        title: 'Strengths and Skills',
        intro: [
          'This is about what builds you up — not just what feels comforting. It includes strengths you already have, skills you use, things you do well, and things you would like to build.',
          'Some strengths feel obvious. Some only become clear over time. Some you may not recognise yet. You can choose what feels true for you.',
        ],
        questions: [
          {
            key: 'strengths',
            type: 'multi',
            label: 'Strengths and skills',
            options: opts([
              ['caring_for_others', 'Caring for others'],
              ['problem_solving', 'Problem solving'],
              ['creativity', 'Creativity (writing, art, photography, making things)'],
              ['practical_hands_on', 'Practical or hands-on skills'],
              ['communication_listening', 'Communication or listening'],
              ['organisation_planning', 'Organisation or planning'],
              ['advocacy_speaking_up', 'Advocacy or speaking up'],
              ['technology_digital', 'Technology or digital skills'],
              ['learning_by_doing', 'Learning by doing'],
              ['gardening_environment', 'Gardening or environmental care'],
              ['music_performance', 'Music, singing, acting, or performance'],
              ['something_else', 'Something else'],
            ]),
          },
          { key: 'strengths_other', type: 'textarea', label: 'Something else' },
        ],
      },
      {
        title: 'Things That Help Maintain My Health and Stability',
        intro: [
          'This includes things that are not always "optional," but are important for maintaining function or wellbeing.',
        ],
        questions: [
          {
            key: 'stability_practices',
            type: 'multi',
            label: 'What helps you stay stable and well',
            options: opts([
              ['exercise_movement', 'Exercise or movement (including physiotherapy, gym, walking, structured activity)'],
              ['stretching_rehab', 'Stretching, mobility, or rehabilitation routines'],
              ['mental_health_practices', 'Mental health therapy or structured recovery practices'],
              ['rest_pacing', 'Rest and pacing'],
              ['structured_routines', 'Structured routines'],
              ['time_outdoors', 'Time outdoors'],
              ['something_else', 'Something else'],
            ]),
          },
          { key: 'stability_other', type: 'textarea', label: 'Something else' },
        ],
      },
    ],
  },
  {
    key: 'goals',
    order: 5,
    title: 'My Goals',
    description: 'What you are working towards and what good progress looks like.',
    groups: [
      {
        title: 'What I Am Working Towards',
        intro: [
          'Your goals can change over time, and you can update them whenever you need. Your Daily Logs can link to these goals, so progress builds up as evidence over time.',
        ],
        questions: [
          {
            key: 'primary_aspiration',
            type: 'textarea',
            required: true,
            label: 'What are you currently working towards?',
            placeholder:
              'For example:\n• Becoming more independent at home\n• Finding a job\n• Travelling independently\n• Improving communication',
          },
          { key: 'goal_steps', type: 'steps', label: 'Steps Towards My Goal' },
        ],
      },
      {
        title: 'Things I Would Like More Of In My Life',
        questions: [
          {
            key: 'more_of_life',
            type: 'multi',
            label: 'What you would like more of',
            options: opts([
              ['calmer_settled', 'Feeling calmer or more settled'],
              ['more_confident', 'Feeling more confident'],
              ['less_overwhelmed', 'Feeling less overwhelmed'],
              ['more_connection', 'More connection'],
              ['more_independence', 'More independence'],
              ['more_purpose', 'More purpose'],
              ['more_enjoyment', 'More enjoyment'],
              ['work_or_study', 'Returning to work or study'],
              ['physical_strength', 'Improving my physical strength or stamina'],
              ['mental_resilience', 'Improving my mental resilience'],
              ['not_sure_yet', 'I am not sure yet'],
            ]),
          },
          { key: 'more_of_notes', type: 'textarea', label: EXPLAIN_FURTHER },
        ],
      },
    ],
  },
  {
    key: 'daily_living',
    order: 6,
    title: 'Daily Living',
    description: 'How daily routines work best for you.',
    groups: [
      {
        title: 'Personal Care and Body',
        intro: [
          'This looks at how you manage everyday personal care. For some people, this is straightforward. For others, physical symptoms, trauma responses, executive functioning, fatigue, pain, or overwhelm can affect consistency.',
          'You can choose what feels true for you.',
        ],
        questions: [
          {
            key: 'personal_care_physical',
            type: 'multi',
            label: 'Physical Assistance',
            options: opts([
              ['full_assistance', 'I need full physical assistance with showering, dressing, or personal hygiene'],
              ['partial_assistance', 'I need partial or shared assistance with some aspects of personal care'],
              ['transfers_positioning', 'I need help with transfers, positioning, or physical stability'],
              ['continence', 'I require continence aids or assistance with continence routines'],
              ['skin_care', 'I need support to manage skin care or prevent breakdown'],
            ]),
          },
          {
            key: 'personal_care_prompting',
            type: 'multi',
            label: 'Prompting, Structure, or Emotional Support',
            options: opts([
              ['encouragement_prompting', 'I sometimes need encouragement or prompting to shower or complete hygiene routines'],
              ['structure_reminders', 'I can do these things, but only with structure, reminders, or accountability'],
              ['trauma_overwhelm', 'Trauma, anxiety, shutdown, or overwhelm can make personal care difficult'],
              ['urgency_builds', 'I tend to manage hygiene only when urgency builds up'],
              ['fatigue_burnout', 'Fatigue or burnout affects how consistently I maintain personal care'],
            ]),
          },
          {
            key: 'personal_care_fluctuation',
            type: 'multi',
            label: 'Fluctuation',
            options: opts([
              ['consistent', 'My needs in this area are consistent'],
              ['fluctuate', 'My needs fluctuate depending on stress, health, or energy'],
              ['harder_difficult_periods', 'During difficult periods, this area becomes significantly harder'],
            ]),
          },
          { key: 'personal_care_notes', type: 'textarea', label: EXPLAIN_FURTHER },
        ],
      },
      {
        title: 'Food, Meals, and Everyday Nutrition',
        intro: [
          'This looks at how meals and food work in your everyday life.',
          'Eating well is not just about cooking. It can involve physical effort, planning, energy, memory, coordination, and emotional stability. You can choose what feels true for you.',
        ],
        questions: [
          {
            key: 'food_impacts',
            type: 'multi',
            label: 'How This Affects My Daily Life',
            options: opts([
              ['cannot_prepare_meals', 'I am not able to prepare meals on my own'],
              ['standing_painful', 'Standing long enough to cook is too painful or exhausting'],
              ['strength_coordination', 'I struggle with strength, coordination, or steady hands when cooking'],
              ['special_equipment', 'I need special equipment or setup to cook safely'],
              ['specific_food_needs', 'I have specific food needs that must be followed for my health'],
              ['planning_overwhelming', 'Planning meals feels overwhelming'],
              ['shopping_exhausting', 'Grocery shopping is exhausting or difficult'],
              ['cooking_energy', 'Cooking takes more energy than I usually have'],
              ['forget_to_eat', 'I forget to eat or drink regularly'],
              ['simple_foods_skip_meals', 'During harder periods, I rely on very simple foods or skip meals'],
              ['sensory_issues', 'Sensory issues affect what I can tolerate eating'],
              ['stress_appetite', 'Stress or emotional overwhelm affects my appetite'],
              ['unstructured_eating', 'My eating patterns can become unstructured or difficult to manage'],
              ['changes_with_state', 'My ability to manage food changes depending on stress, fatigue, or health'],
            ]),
          },
          {
            key: 'food_support',
            type: 'multi',
            label: 'Support I May Need in This Area',
            options: opts([
              ['full_meal_support', 'I need full support with preparing meals'],
              ['shared_cooking', 'I need shared support with cooking'],
              ['kitchen_setup', 'I need help setting up my kitchen safely'],
              ['grocery_shopping', 'I need support with grocery shopping'],
              ['meal_planning', 'I need help planning meals'],
              ['eating_reminders', 'I need reminders or structure around eating'],
              ['consistent_nutrition', 'I need support to maintain consistent nutrition'],
              ['increased_difficult_periods', 'During difficult periods, I need increased support with meals'],
            ]),
          },
          { key: 'food_notes', type: 'textarea', label: EXPLAIN_FURTHER },
        ],
      },
      {
        title: 'Household Routines and Keeping Up With the Home',
        intro: [
          'A home is not just a place to sleep. The condition of your environment can affect how you feel emotionally, physically, and mentally.',
          'For many people, clutter, unfinished jobs, or a space that feels chaotic can increase stress, overwhelm, and exhaustion. A clean, safe, and organised home can create stability, reduce anxiety, and make daily life feel more manageable.',
          'Everyone is entitled to live in a space that feels comfortable and dignified. Needing support to maintain that is not a failure. It is often a practical and reasonable part of disability support. You can choose what feels true for you.',
        ],
        questions: [
          {
            key: 'household_impacts',
            type: 'multi',
            label: 'How This Affects My Daily Life',
            options: opts([
              ['cannot_complete', 'I am not able to complete household routines on my own'],
              ['cleaning_effort', 'Cleaning takes more physical effort than I can manage'],
              ['bending_lifting', 'Bending, lifting, or reaching is difficult or painful'],
              ['laundry', 'I struggle to keep up with laundry'],
              ['bedding', 'Changing bedding is too physically demanding'],
              ['builds_up', 'Housework builds up quickly when my energy drops'],
              ['starting_overwhelming', 'Starting cleaning feels overwhelming'],
              ['cannot_get_started', 'I know what needs to be done but cannot get started'],
              ['exhausted_after_one', 'After one job, I am too exhausted to continue'],
              ['clutter_stress', 'Clutter builds up during stressful periods'],
              ['avoid_big_jobs', 'I avoid certain jobs because they feel too big'],
              ['changes_with_state', 'My ability to keep up with the home changes depending on stress, fatigue, or health'],
            ]),
          },
          {
            key: 'household_support',
            type: 'multi',
            label: 'Support I May Need in This Area',
            options: opts([
              ['full_cleaning_support', 'I need full support with household cleaning'],
              ['shared_cleaning', 'I need shared support with cleaning'],
              ['laundry_support', 'I need support with laundry'],
              ['bedding_support', 'I need support changing bedding'],
              ['organising_home', 'I need support organising my home'],
              ['structure_prompting', 'I need structure or prompting to keep things manageable'],
              ['increased_difficult_periods', 'During difficult periods, I need increased support'],
            ]),
          },
          { key: 'household_notes', type: 'textarea', label: EXPLAIN_FURTHER },
        ],
      },
    ],
  },
  {
    key: 'mobility_access',
    order: 7,
    title: 'Mobility & Access',
    description: 'How you move around and access places safely and comfortably.',
    groups: [
      {
        title: 'Getting Around and Leaving the House',
        intro: [
          'This looks at how you move through your home and community.',
          'Getting around is not only about walking. It can include balance, stamina, pain levels, confidence, anxiety, energy, and how safe you feel. You can choose what feels true for you.',
        ],
        questions: [
          {
            key: 'mobility_impacts',
            type: 'multi',
            label: 'How This Affects My Daily Life',
            options: opts([
              ['cannot_stand_walk', 'I am unable to stand or walk independently'],
              ['cannot_weight_bear', 'I am unable to weight-bear safely'],
              ['rely_on_equipment', 'I rely on a wheelchair or other mobility equipment for daily movement'],
              ['need_physical_support', 'I cannot move safely without physical support'],
              ['short_periods_exhausting', 'Walking or standing for short periods is exhausting'],
              ['pain_limits', 'Pain affects how far or how long I can move'],
              ['stamina_drops', 'My stamina drops quickly'],
              ['recovery_time', 'After activity, I need significant recovery time'],
              ['unsteady_falls', 'I feel unsteady or at risk of falling'],
              ['avoid_overwhelming', 'I avoid leaving the house because it feels overwhelming'],
              ['busy_environments', 'Busy or noisy environments affect my confidence or safety'],
              ['anxiety_shutdown', 'Anxiety or shutdown affects my ability to go out'],
              ['changes_with_state', 'My ability to get around changes depending on stress, fatigue, or health'],
            ]),
          },
          {
            key: 'mobility_support',
            type: 'multi',
            label: 'Support I May Need in This Area',
            options: opts([
              ['full_physical_support', 'I need full physical support to move safely'],
              ['partial_physical_support', 'I need partial or shared physical support'],
              ['transfers', 'I need support with transfers (bed, chair, vehicle, shower)'],
              ['aids_management', 'I use mobility aids and need support managing them'],
              ['pacing_energy', 'I need pacing or energy management support'],
              ['leaving_house', 'I sometimes need support to leave the house or attend appointments'],
              ['reassurance_regulation', 'I need reassurance or regulation support when out in the community'],
              ['increased_difficult_periods', 'During difficult periods, I need increased support'],
            ]),
          },
          { key: 'mobility_notes', type: 'textarea', label: EXPLAIN_FURTHER },
        ],
      },
      {
        title: 'Equipment, Technology, and Environmental Supports',
        intro: [
          'Some people use equipment or technology to make daily life easier, safer, or more independent. This might include physical aids, communication tools, sensory supports, home modifications, or reminder systems.',
          'Some people already have what they need. Others need support to access or maintain these tools. This helps us understand what supports your independence and safety.',
        ],
        questions: [
          {
            key: 'equipment_current',
            type: 'multi',
            label: 'What I Currently Use',
            options: opts([
              ['mobility_aids', 'I use mobility aids (wheelchair, walker, cane, etc.)'],
              ['communication_aids', 'I use communication aids or assistive devices'],
              ['continence_products', 'I use continence products'],
              ['medication_organisers', 'I use medication organisers or alarms'],
              ['routine_technology', 'I use technology to manage routines or reminders'],
              ['sensory_supports', 'I use sensory supports (headphones, weighted items, low-light spaces, etc.)'],
              ['home_modifications', 'I use home modifications (rails, ramps, shower supports, etc.)'],
              ['specialised_equipment', 'I use specialised equipment for eating, dressing, or daily routines'],
              ['smart_devices', 'I use smart devices or apps to support independence'],
            ]),
          },
          {
            key: 'equipment_support',
            type: 'multi',
            label: 'Support I May Need With Equipment or Technology',
            options: opts([
              ['setup_maintenance', 'I need support setting up or maintaining equipment'],
              ['learning_to_use', 'I need help learning how to use equipment'],
              ['replacing_repairing', 'I need support replacing or repairing items'],
              ['updated_equipment', 'I need updated equipment as my needs change'],
              ['would_help', 'I do not currently have equipment but believe it would help'],
              ['funding_access', 'I need support funding or accessing assistive technology'],
            ]),
          },
          { key: 'equipment_notes', type: 'textarea', label: EXPLAIN_FURTHER },
        ],
      },
    ],
  },
  {
    key: 'health_wellbeing',
    order: 8,
    title: 'Health & Wellbeing',
    description: 'Things that affect your energy, health, wellbeing and pacing.',
    groups: [
      {
        title: 'Emotional Regulation, Stress, and Your Nervous System',
        intro: [
          'Everyone responds to stress differently. For some people, stress passes through quickly. For others, stress builds up in the body and nervous system and affects thinking, energy, emotions, or safety.',
          'This is not about weakness or personality. It is about how your body and nervous system respond to pressure, change, or overwhelm.',
          'For people with trauma histories, ADHD, autism, chronic illness, pain, or long-term stress, the nervous system can become more sensitive. This means daily demands may take more energy, and recovery may take longer.',
          'This helps you describe what stress actually feels like in your real life — and what support makes a difference. You can choose what feels true for you.',
        ],
        questions: [
          {
            key: 'stress_impacts',
            type: 'multi',
            label: 'How This Affects My Daily Life',
            options: opts([
              ['overwhelmed_easily', 'I become overwhelmed more easily than others realise'],
              ['thinking_clearly', 'When stressed, I struggle to think clearly'],
              ['shut_down', 'I shut down or withdraw during difficult periods'],
              ['emotionally_flooded', 'I feel emotionally flooded when things build up'],
              ['anxiety_panic', 'I experience intense anxiety or panic'],
              ['reactive_irritable', 'I become more reactive or irritable under pressure'],
              ['on_edge', 'I feel constantly alert or "on edge"'],
              ['sensory_distress', 'Noise, light, crowds, or busy spaces increase distress'],
              ['social_drain', 'After social interaction, I feel completely drained'],
              ['burnout', 'Burnout affects my ability to function consistently'],
              ['isolate', 'During harder periods, I isolate myself'],
              ['changes_with_state', 'My emotional stability changes depending on stress, health, or environment'],
            ]),
          },
          {
            key: 'stress_support',
            type: 'multi',
            label: 'Support I May Need in This Area',
            options: opts([
              ['calm_steady_support', 'I need calm, steady support when overwhelmed'],
              ['slowing_down', 'I need help slowing things down'],
              ['grounding_reassurance', 'I need grounding or reassurance during distress'],
              ['early_signs', 'I need support recognising early signs of overload'],
              ['routines_when_stressed', 'I need help maintaining routines when stressed'],
              ['reduced_demands', 'I need reduced demands during burnout'],
              ['flexibility', 'I need flexibility when my capacity fluctuates'],
              ['increased_difficult_periods', 'During difficult periods, I need increased support'],
            ]),
          },
          { key: 'stress_notes', type: 'textarea', label: EXPLAIN_FURTHER },
        ],
      },
      {
        title: 'Health, Medication, and Ongoing Support',
        intro: [
          'Health is part of everyday life. For some people, health needs are simple and manageable. For others, physical conditions, mental health challenges, chronic illness, pain, fatigue, continence needs, or medication routines take significant energy and planning.',
          'This is about understanding how your health affects your daily life — and what support helps you stay stable, safe, and well. You can choose what feels true for you.',
        ],
        questions: [
          {
            key: 'health_impacts',
            type: 'multi',
            label: 'How Health Affects My Daily Life',
            options: opts([
              ['physical_conditions', 'I live with ongoing physical health conditions'],
              ['mental_health', 'I live with ongoing mental health challenges'],
              ['pain', 'Pain affects my daily functioning'],
              ['fatigue', 'Fatigue affects my energy and consistency'],
              ['week_to_week', 'My health changes from week to week'],
              ['appointments', 'I struggle to manage appointments on my own'],
              ['avoid_care', 'I avoid medical care because it feels overwhelming'],
              ['medication_consistency', 'I forget or struggle to take medication consistently'],
              ['medication_effects', 'Medication affects my energy, mood, or concentration'],
              ['side_effects', 'I need support managing side effects'],
              ['continence_care', 'I need support with continence care or continence products'],
              ['stress_increases', 'My health needs increase during stressful periods'],
              ['knock_on_effects', 'When my health worsens, other areas of life are affected'],
            ]),
          },
          {
            key: 'health_support',
            type: 'multi',
            label: 'Support That Helps Me Stay Well',
            options: opts([
              ['independent', 'I manage my health independently'],
              ['medication_reminders', 'I sometimes need reminders to take medication'],
              ['physical_help_medication', 'I need someone to physically help me take medication'],
              ['medication_supervision', 'I need supervision to make sure medication is taken safely'],
              ['medication_administered', 'I need medication given to me regularly'],
              ['nursing_support', 'I need nursing or specialised health support'],
              ['prescriptions_supplies', 'I need help organising prescriptions or medical supplies'],
              ['attending_appointments', 'I need support attending medical appointments'],
              ['pain_fatigue_support', 'I need support managing pain or fatigue'],
              ['continence_support', 'I need support with continence care'],
              ['emotional_support', 'I need emotional support during health challenges'],
              ['increased_difficult_periods', 'During harder periods, I need increased support'],
            ]),
          },
          { key: 'health_notes', type: 'textarea', label: EXPLAIN_FURTHER },
        ],
      },
      {
        title: 'Frequency, Stability, and Changing Needs',
        intro: [
          'Support does not look the same for everyone. Some people need daily or ongoing support without change. Others experience periods of stability and periods where support needs increase.',
          'Fluctuation does not mean failure. Needing more support at certain times does not mean you are not trying. This helps describe how steady or changeable your support needs are.',
        ],
        questions: [
          {
            key: 'support_over_time',
            type: 'multi',
            label: 'My Support Needs Over Time',
            options: opts([
              ['daily_support', 'I need consistent daily support'],
              ['multiple_times_daily', 'I need support multiple times per day'],
              ['throughout_day', 'I require ongoing support throughout the day'],
              ['steady_predictable', 'My support needs are steady and predictable'],
              ['increase_stress_illness', 'My support needs increase during stress or illness'],
              ['increase_overwhelm', 'My support needs increase during emotional overwhelm'],
              ['increase_health_decline', 'My support needs increase when my physical health declines'],
              ['varies_weekly', 'Some weeks I manage independently, other weeks I need more support'],
              ['cancel_when_overwhelmed', 'I sometimes cancel support when I feel overwhelmed'],
              ['consistency_struggle', 'I struggle to maintain consistency'],
              ['routine_changes', 'When routines change, my support needs increase'],
              ['need_flexibility', 'I need flexibility because my capacity changes'],
              ['crisis_increases', 'I need crisis or short-term increases in support at times'],
            ]),
          },
          {
            key: 'when_needs_change',
            type: 'multi',
            label: 'What Helps When My Needs Change',
            options: opts([
              ['flexible_scheduling', 'Flexible scheduling'],
              ['shorter_more_often', 'Shorter sessions more often'],
              ['longer_harder_periods', 'Longer sessions during harder periods'],
              ['reduced_demands', 'Reduced demands during burnout'],
              ['gradual_return', 'Gradual return to routine'],
              ['clear_communication', 'Clear communication when I need more support'],
              ['predictable_times', 'Predictable support times'],
              ['backup_planning', 'Backup planning for difficult periods'],
            ]),
          },
          {
            key: 'needs_change_notes',
            type: 'textarea',
            label: 'If you would like to explain how your support changes over time',
          },
        ],
      },
      {
        title: 'Support Continuity and Sustainability',
        intro: [
          'Sometimes workers leave, services change, or trust has to be rebuilt with someone new. Starting again can take a lot of energy. If everyday life already feels heavy, having to explain everything again and rebuild safety can feel overwhelming.',
          'Continuity matters — when support is inconsistent or unavailable, it can have a real impact on your daily life. You can choose what feels right for you.',
        ],
        questions: [
          {
            key: 'continuity_impacts',
            type: 'multi',
            label: 'When support is inconsistent or unavailable',
            options: opts([
              ['withdraw', 'I withdraw or find it hard to re-engage'],
              ['routines_harder', 'Daily routines become harder to keep going'],
              ['things_missed', 'Appointments, medication, or paperwork get missed'],
              ['safety_risk', 'My safety risk increases'],
              ['recovery_cost', 'The recovery cost becomes too much'],
              ['other', 'Other'],
            ]),
          },
          { key: 'continuity_notes', type: 'textarea', label: EXPLAIN_FURTHER },
        ],
      },
      {
        title: 'After-Hours and Virtual Support',
        intro: [
          'Support does not always fit neatly into business hours. For some people, evenings, weekends, or times of high stress are when support is most needed. For others, living in remote areas means in-person support is limited or inconsistent.',
          'This helps describe whether flexible or virtual support makes a difference in your safety and stability. You can choose what feels true for you.',
        ],
        questions: [
          {
            key: 'after_hours',
            type: 'multi',
            label: 'After-Hours Support',
            options: opts([
              ['stable_daytime', 'My support needs are generally stable during the day'],
              ['evenings_weekends_harder', 'Evenings or weekends can be harder for me'],
              ['outside_regular_hours', 'I sometimes need support outside regular hours'],
              ['night_safety', 'When I feel overwhelmed at night, I struggle to stay safe'],
              ['checkins_prevent_escalation', 'After-hours check-ins help prevent escalation'],
              ['avoid_crisis_services', 'Access to timely support helps me avoid hospital or crisis services'],
              ['not_needed', 'I do not currently need after-hours support'],
            ]),
          },
          {
            key: 'virtual_support',
            type: 'multi',
            label: 'Virtual or Remote Support',
            options: opts([
              ['remote_area', 'I live in a remote or regional area'],
              ['limited_local', 'Local supports are limited'],
              ['virtual_works', 'Virtual support works well for me'],
              ['when_housebound', 'I need virtual support when I cannot leave the house'],
              ['video_phone_connection', 'Video or phone support helps me stay connected'],
              ['technology_help', 'I need help accessing technology for remote support'],
              ['prefer_in_person', 'I prefer in-person support where possible'],
            ]),
          },
          {
            key: 'after_hours_notes',
            type: 'textarea',
            label: 'If you would like to explain what feels safest and most supportive',
          },
        ],
      },
    ],
  },
  {
    key: 'social_community',
    order: 9,
    title: 'Social & Community',
    description: 'How you like to participate, connect and spend time with others.',
    groups: [
      {
        title: 'Community Participation and Everyday Life',
        intro: [
          'Being part of the community is part of living an ordinary life. This can mean different things for different people: seeing friends, attending appointments, going to work or study, exercising, shopping, being part of groups, spending time outside the home, or participating in hobbies or interests.',
          'Community life supports wellbeing. It reduces isolation. It helps people maintain identity, routine, and connection.',
          'For some people, getting out into the community feels simple. For others, it requires planning, energy, physical support, regulation, or recovery time. This is about understanding what participation looks like for you — and what support makes it possible.',
        ],
        questions: [
          {
            key: 'community_impacts',
            type: 'multi',
            label: 'How This Affects My Daily Life',
            options: opts([
              ['cannot_leave_alone', 'I cannot leave the house on my own'],
              ['support_every_time', 'I need support every time I leave the house'],
              ['support_sometimes', 'I sometimes need support to leave the house'],
              ['appointments_energy', 'It takes a lot of energy for me to attend appointments'],
              ['avoid_physical', 'I avoid going out because it feels physically difficult'],
              ['avoid_overwhelming', 'I avoid going out because it feels overwhelming'],
              ['transport', 'I need support with transport'],
              ['busy_places', 'Busy places increase my stress, fatigue, or discomfort'],
              ['recovery_time', 'I need recovery time after being out'],
              ['physical_limits', 'Pain, fatigue, or other physical challenges limit how often I can go out'],
              ['cancel_plans', 'I cancel plans when my energy drops'],
              ['isolated', 'I feel isolated at times'],
              ['blocked', 'I want to participate more but feel blocked'],
              ['changes_with_state', 'My ability to get out changes depending on how I am feeling'],
            ]),
          },
          {
            key: 'community_support',
            type: 'multi',
            label: 'Support That Makes Participation Possible',
            options: opts([
              ['physical_support', 'I need physical support to leave the house'],
              ['someone_with_me', 'I need someone with me when I go out'],
              ['feel_safe_leaving', 'I sometimes need support to feel safe leaving the house'],
              ['transport_support', 'I need support with transport'],
              ['planning_outings', 'I need support planning appointments or outings'],
              ['schedule_reminders', 'I need reminders or help organising my schedule'],
              ['anxiety_when_out', 'I need support managing anxiety or overwhelm when I am out'],
              ['pacing', 'I need pacing before and after activities'],
              ['flexibility', 'I need flexibility when my energy or mood changes'],
              ['stay_connected', 'During harder periods, I need increased support to stay connected'],
              ['rebuild_gradually', 'I need gradual support to rebuild participation'],
            ]),
          },
          { key: 'community_notes', type: 'textarea', label: EXPLAIN_FURTHER },
        ],
      },
    ],
  },
  {
    key: 'decision_making',
    order: 10,
    title: 'Decision Making',
    description: 'How you make choices and what support helps you stay in control.',
    groups: [
      {
        title: 'Planning, Organisation, and Mental Load',
        intro: [
          'This looks at the invisible work of everyday life. Planning, remembering, making decisions, managing paperwork, and staying organised can require a lot of mental energy.',
          'For some people, this feels manageable. For others, it can become overwhelming, confusing, or exhausting. You can choose what feels true for you.',
        ],
        questions: [
          {
            key: 'planning_impacts',
            type: 'multi',
            label: 'How This Affects My Daily Life',
            options: opts([
              ['planning_difficult', 'I find it difficult to plan or organise everyday things'],
              ['remembering', 'I struggle to remember appointments or important dates'],
              ['paperwork', 'Paperwork and forms feel overwhelming'],
              ['phone_calls', 'Phone calls or official conversations are stressful or confusing'],
              ['complex_information', 'I have trouble understanding complex information'],
              ['processing_time', 'I need extra time to process information'],
              ['decisions_overwhelming', 'Making decisions feels overwhelming'],
              ['finishing_things', 'I start things but struggle to finish them'],
              ['avoid_big_things', 'I avoid things because they feel too big'],
              ['money_bills', 'Managing money or bills feels difficult'],
              ['mental_exhaustion', 'I feel mentally exhausted quickly'],
              ['changes_with_state', 'My ability to think clearly changes depending on stress, fatigue, or health'],
              ['stuck_harder_periods', 'During harder periods, I feel stuck or unable to organise myself'],
            ]),
          },
          {
            key: 'planning_support',
            type: 'multi',
            label: 'Support I May Need in This Area',
            options: opts([
              ['organising_appointments', 'I need help organising appointments'],
              ['understanding_paperwork', 'I need support understanding paperwork or official documents'],
              ['making_decisions', 'I need help making decisions'],
              ['reminders_structure', 'I need reminders or structured support'],
              ['bills_finances', 'I need help managing bills or finances'],
              ['sit_with_me', 'I need someone to sit with me while completing forms or making calls'],
              ['smaller_steps', 'I need support breaking things into smaller steps'],
              ['increased_difficult_periods', 'During difficult periods, I need increased support'],
            ]),
          },
          { key: 'planning_notes', type: 'textarea', label: EXPLAIN_FURTHER },
        ],
      },
    ],
  },
  {
    key: 'safety_preferences',
    order: 11,
    title: 'Safety & Support Preferences',
    description: 'Important safety, comfort and support preferences people should understand.',
    groups: [
      {
        title: 'My Home and Environment',
        intro: [
          'Everyone has the right to make their own choices in life. That includes choices about how you relax, how you live, and what you do in your own home.',
          'At the same time, when support workers are present, there needs to be shared understanding about safety — for you and for them. This is not about judgment. It is about clarity. Open conversations are safer than hidden ones. Agreed boundaries are safer than assumptions.',
        ],
        questions: [
          {
            key: 'home_environment',
            type: 'multi',
            label: 'My Home and Environment',
            options: opts([
              ['generally_safe', 'My home environment is generally safe for support work'],
              ['clutter_hazards', 'There may be clutter, animals, or environmental hazards'],
              ['pets', 'I have pets that workers should be aware of'],
              ['medical_items', 'There may be medical items (e.g., needles, equipment) in my space'],
              ['want_safer', 'I would like support to make my space safer'],
              ['manage_independently', 'I prefer to manage my environment independently'],
            ]),
          },
          {
            key: 'home_environment_notes',
            type: 'textarea',
            label: 'If there is anything workers should know about your home environment',
          },
        ],
      },
      {
        title: 'Alcohol or Substance Use',
        intro: [
          'People have different relationships with alcohol or other substances. This is about openness and safety, not judgment.',
        ],
        questions: [
          {
            key: 'substance_use',
            type: 'multi',
            label: 'What feels true for you',
            options: opts([
              ['none', 'I do not use alcohol or substances'],
              ['occasional_alcohol', 'I occasionally drink alcohol'],
              ['regular_alcohol', 'I regularly drink alcohol'],
              ['other_substances', 'I use other substances'],
              ['no_effect_on_support', 'My substance use does not affect support'],
              ['sometimes_affects', 'My substance use sometimes affects my safety or support'],
              ['discuss_boundaries', 'I would like to talk about safe boundaries when support workers are present'],
            ]),
          },
        ],
      },
      {
        title: 'Shared Safety When Support Is Present',
        questions: [
          {
            key: 'shared_safety',
            type: 'multi',
            label: 'What feels true for you',
            options: opts([
              ['safety_first', 'I agree that when a worker is present, safety needs to come first'],
              ['agree_safe_limits', 'I would like to agree on safe limits during support hours'],
              ['pacing_harm_reduction', 'I may need support around pacing or harm reduction'],
              ['open_conversations', 'I prefer open conversations rather than restrictions'],
              ['respectful_boundaries', 'I would like clear boundaries that feel respectful'],
              ['understand_impairment', 'During support hours, I understand workers cannot provide support if I am severely impaired'],
            ]),
          },
          {
            key: 'shared_safety_notes',
            type: 'textarea',
            label: 'If you would like to describe what feels fair and safe for you',
          },
        ],
      },
      {
        title: 'Relational Compatibility and Support Style',
        intro: [
          'Support is not just about completing everyday activities or assisting you in achieving your goals. The relationship between you and the person supporting you matters.',
          'When you are choosing a support worker, it is important that the fit feels safe, respectful, and aligned with you. Everyone feels more comfortable with different communication styles, personalities, and approaches. There is nothing wrong with wanting a good fit.',
          'Choice and control includes choosing support that feels right for you. This helps you think about what works best when selecting someone to support you.',
        ],
        questions: [
          {
            key: 'support_style_comfortable',
            type: 'multi',
            label: 'What Feels Comfortable for Me',
            options: opts([
              ['calm_steady', 'I prefer a calm and steady support person'],
              ['warm_conversational', 'I prefer someone who is warm and conversational'],
              ['structured_focused', 'I prefer someone who is more structured and focused'],
              ['takes_initiative', 'I prefer someone who takes initiative'],
              ['waits_for_direction', 'I prefer someone who waits for direction'],
              ['patient_when_overwhelmed', 'I need someone patient when I am overwhelmed'],
              ['understands_trauma', 'I need someone who understands trauma or nervous system sensitivity'],
              ['lived_experience', 'I prefer someone with lived experience'],
              ['professional_qualifications', 'I prefer someone with professional qualifications'],
              ['particular_gender', 'I prefer a particular gender'],
              ['particular_orientation', 'I prefer someone of a particular sexual orientation'],
              ['lgbtqia_affirming', 'I prefer someone who is LGBTQIA+ affirming'],
              ['similar_culture', 'I prefer someone from a similar cultural background'],
              ['respects_privacy', 'I prefer someone who respects my privacy and quiet time'],
              ['flexible', 'I am flexible about support style'],
            ]),
          },
          {
            key: 'support_style_not_work',
            type: 'multi',
            label: 'What Does Not Work for Me',
            options: opts([
              ['being_rushed', 'Being rushed'],
              ['patronising', 'Being spoken to in a patronising way'],
              ['treated_incapable', 'Being treated like I cannot make decisions'],
              ['judged_lifestyle', 'Being judged for my lifestyle'],
              ['too_much_talking', 'Too much talking'],
              ['too_little_communication', 'Too little communication'],
              ['overly_clinical', 'Overly clinical approaches'],
              ['lack_of_boundaries', 'Lack of boundaries'],
              ['unclear_expectations', 'Unclear expectations'],
            ]),
          },
          {
            key: 'support_style_notes',
            type: 'textarea',
            label: 'If you would like to describe what feels safe and supportive',
          },
        ],
      },
      {
        title: 'Boundaries and the Support Relationship',
        intro: [
          'Support is a real human relationship. It involves conversation, shared moments, humour, and sometimes even shared vulnerability. That is normal. Human warmth is not unprofessional. This type of relationship is known as relational discipline.',
          'However, there is an important distinction: a support worker is being paid to support you. You are not responsible for supporting them. They will not lean on you for support or expect you to carry their feelings, manage their stress, or take care of them. That boundary exists to protect you.',
          'Healthy support relationships can still include warmth, humour, shared interests, relaxed conversation, and appropriate self-disclosure. But they remain clear: the worker’s role is to support you — not the other way around. This clarity protects your autonomy, your funding, and the integrity of the relationship.',
        ],
        questions: [
          {
            key: 'boundaries_comfortable',
            type: 'multi',
            label: 'In Support Relationships, I Feel Most Comfortable When',
            options: opts([
              ['appropriate_boundaries', 'The worker keeps appropriate boundaries'],
              ['not_responsible_for_them', 'I am not made to feel responsible for them'],
              ['clear_respectful', 'Communication is clear and respectful'],
              ['feedback_safely', 'I can give feedback safely'],
              ['warmth_without_pressure', 'There is warmth without pressure'],
              ['know_what_to_expect', 'I know what to expect'],
              ['safe_saying_no', 'I feel safe saying no'],
              ['safe_raising_concerns', 'I feel safe raising concerns'],
              ['treated_as_equal', 'I am treated as an equal'],
            ]),
          },
          {
            key: 'boundaries_notes',
            type: 'textarea',
            label:
              'If there is anything that feels particularly sensitive or difficult for you in support relationships',
          },
        ],
      },
    ],
  },
];

// The flat question list per section is what validation (and the API) reads;
// groups exist for rendering. Derived once here so the two can never diverge.
for (const section of PROFILE_SECTIONS) {
  section.questions = section.groups.flatMap((group) => group.questions);
}

export const PROFILE_TOTAL_SECTIONS = PROFILE_SECTIONS.length;

/** Canonical keys are snake_case (seed); URLs use kebab-case slugs. */
export const profileSectionSlug = (key) => key.replace(/_/g, '-');

const SECTION_BY_KEY = new Map(PROFILE_SECTIONS.map((section) => [section.key, section]));
const SECTION_BY_SLUG = new Map(
  PROFILE_SECTIONS.map((section) => [profileSectionSlug(section.key), section])
);

/** @returns the section definition, or undefined for an unknown key. */
export const profileSection = (key) => SECTION_BY_KEY.get(key);

/** @returns the section definition for a URL slug, or undefined. */
export const profileSectionBySlug = (slug) => SECTION_BY_SLUG.get(slug);

/** The section after this one in seed order, or null at the end. */
export function nextProfileSection(key) {
  const index = PROFILE_SECTIONS.findIndex((section) => section.key === key);
  return index >= 0 ? (PROFILE_SECTIONS[index + 1] ?? null) : null;
}

/**
 * "No answer" — distinct from a falsy answer: an unticked toggle saved as
 * `false` is an explicit answer, an empty string or empty list is not.
 */
export function isEmptyAnswer(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

const isPlainString = (value, max) => typeof value === 'string' && value.length <= max;

const isAllowedOption = (question, value) =>
  question.options.some((option) => option.value === value);

/** @returns null when valid, otherwise a message safe to show the caller. */
export function validateAnswerValue(question, value) {
  if (isEmptyAnswer(value)) return null; // clearing an answer is always allowed
  switch (question.type) {
    case 'text':
      return isPlainString(value, MAX_TEXT) ? null : `Must be text up to ${MAX_TEXT} characters.`;
    case 'textarea':
      return isPlainString(value, MAX_TEXTAREA)
        ? null
        : `Must be text up to ${MAX_TEXTAREA} characters.`;
    case 'select':
      return isAllowedOption(question, value) ? null : 'Not one of the allowed options.';
    case 'multi':
      if (!Array.isArray(value) || value.length > MAX_MULTI) return 'Must be a list of options.';
      return value.every((item) => isAllowedOption(question, item))
        ? null
        : 'Contains an option that is not allowed.';
    case 'toggle':
      return typeof value === 'boolean' ? null : 'Must be true or false.';
    case 'scale':
      return Number.isInteger(value) && value >= question.min && value <= question.max
        ? null
        : `Must be a whole number between ${question.min} and ${question.max}.`;
    case 'steps':
      if (!Array.isArray(value) || value.length > MAX_STEPS) return 'Must be a list of steps.';
      return value.every(
        (step) =>
          step &&
          typeof step === 'object' &&
          !Array.isArray(step) &&
          isPlainString(step.text, MAX_TEXT) &&
          typeof step.done === 'boolean'
      )
        ? null
        : 'Each step needs text and a done flag.';
    default:
      return 'Unknown question type.';
  }
}

/**
 * Validates a section save. Unknown question keys are rejected — the client
 * and server must be reading the same definition of the section.
 *
 * @returns map of question_key -> error message; empty object when valid.
 */
export function validateSectionAnswers(section, answers = {}) {
  const errors = {};
  const questionByKey = new Map(section.questions.map((question) => [question.key, question]));
  for (const [key, value] of Object.entries(answers)) {
    const question = questionByKey.get(key);
    if (!question) {
      errors[key] = 'Unknown question for this section.';
      continue;
    }
    const error = validateAnswerValue(question, value);
    if (error) errors[key] = error;
  }
  return errors;
}

/**
 * Completion rule: every `required` question answered; a section with no
 * required questions completes on its first non-empty answer. Completion is
 * sticky — the API never demotes a complete section (Jiten, 2026-08-04).
 */
export function isSectionComplete(section, answers = {}) {
  const required = section.questions.filter((question) => question.required);
  if (required.length > 0) {
    return required.every((question) => !isEmptyAnswer(answers[question.key]));
  }
  return section.questions.some((question) => !isEmptyAnswer(answers[question.key]));
}
