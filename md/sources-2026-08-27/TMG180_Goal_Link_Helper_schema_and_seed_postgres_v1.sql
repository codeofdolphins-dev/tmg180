
-- =============================================
-- TMG180 Goal Link Helper (v1) - Postgres schema + seed
-- Purpose: Suggest default bucket + goal link prompts + R&N rationale prompts for support evidence logs
-- =============================================

CREATE TABLE IF NOT EXISTS tmg_goal_link_helper (
  support_domain_code TEXT PRIMARY KEY,
  ndis_support_domain TEXT NOT NULL,
  tmg_functional_grouping TEXT NOT NULL,
  ndis_bucket_default TEXT NOT NULL CHECK (ndis_bucket_default IN ('CORE','CAPACITY_BUILDING','CAPITAL')),
  includes_examples TEXT,
  common_goal_links_plain TEXT,
  functional_barrier_plain TEXT,
  rn_rationale_tags TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at trigger function (if not already present)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'set_updated_at') THEN
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tmg_goal_link_helper_set_updated_at') THEN
    CREATE TRIGGER tmg_goal_link_helper_set_updated_at
    BEFORE UPDATE ON tmg_goal_link_helper
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;


INSERT INTO tmg_goal_link_helper (
  support_domain_code, ndis_support_domain, tmg_functional_grouping, ndis_bucket_default, includes_examples, common_goal_links_plain, functional_barrier_plain, rn_rationale_tags
) VALUES
('DL_HOME_ENV', 'Daily Living', 'Home & Environment', 'CORE', 'Household tasks, cleaning, organisation, safety', 'Maintain a safe and usable home; reduce overwhelm and shutdown; sustain routine', 'Functional capacity to maintain safe living environment; fatigue/overwhelm impacts task initiation/completion', 'safety_stability;daily_living_sustainability;reduce_overwhelm'),
('DL_FOOD_NUTR', 'Daily Living', 'Food & Daily Nutrition', 'CORE', 'Meal prep, food planning, eating routines', 'Maintain nutrition routines; reduce overwhelm; support health stability', 'Functional capacity to plan/prepare meals; regulation and energy constraints', 'daily_living_sustainability;health_wellbeing;reduce_overwhelm'),
('DL_PERSONAL_CARE', 'Daily Living', 'Personal Care', 'CORE', 'Showering, dressing, hygiene, toileting', 'Maintain hygiene and dignity; safety; sustain independence at home', 'Functional limitations in self-care tasks; requires assistance for safety/dignity', 'safety_stability;daily_living_sustainability;independence'),
('DL_ROUTINE_STRUCT', 'Daily Living', 'Daily Structure & Routine', 'CORE', 'Get up/bed, structuring day, reminders/prompting', 'Stabilise daily rhythm; prevent collapse/burnout; sustain participation', 'Fluctuating capacity/executive function affects routine; support enables consistency', 'daily_living_sustainability;prevent_regression;sustain_participation'),
('DL_COMM_TASKS', 'Daily Living', 'Community Tasks', 'CORE', 'Shopping, errands, appointments', 'Access essentials; maintain health/appointments; reduce barriers to leaving home', 'Functional capacity to complete tasks outside home; anxiety/overwhelm/fatigue barriers', 'participation_access;safety_stability;reduce_barriers'),
('DL_LIFE_ADMIN', 'Daily Living', 'Life Administration', 'CORE', 'Paperwork, organising daily life, basic planning', 'Keep life functioning; reduce crisis; support decision-making', 'Executive function/cognitive load barriers impact admin; support reduces overload', 'reduce_overwhelm;independence;safety_stability'),
('SC_LEAVING_HOME', 'Social & Community', 'Leaving the House / Showing Up', 'CORE', 'Getting out, attending appts/activities, being present', 'Increase participation; reduce avoidance; access community life', 'Anxiety/overwhelm/shutdown limit leaving home; graded support enables access', 'participation_access;reduce_barriers;prevent_regression'),
('SC_SOCIAL_CONN', 'Social & Community', 'Social Interaction & Connection', 'CORE', 'Conversation, relationships, trust building', 'Build/maintain relationships; reduce isolation; feel safe with people', 'Social anxiety/misinterpretation/emotional safety barriers; support scaffolds interaction', 'belonging_connection;participation_access;emotional_safety'),
('SC_ACTIVITIES', 'Social & Community', 'Participation in Activities', 'CORE', 'Hobbies, groups, recreation, structured activities', 'Meaningful activity; community inclusion; identity and purpose', 'Overwhelm/motivation/fear of failure limits engagement; support sustains participation', 'purpose_identity;belonging_connection;sustain_participation'),
('SC_NAVIGATION', 'Social & Community', 'Community Navigation', 'CORE', 'Access services, navigate environments, decisions', 'Navigate supports/services; reduce decision paralysis; increase independence', 'Cognitive overload/confusion impairs navigation; support enables decision-making', 'independence;reduce_overwhelm;participation_access'),
('SC_EMOT_SAFETY_PUBLIC', 'Social & Community', 'Emotional Safety in Public Spaces', 'CORE', 'Managing triggers and unpredictability outside home', 'Feel safe outside home; reduce escalation; sustain access to life', 'Nervous system regulation barriers; support provides co-regulation/safety planning', 'emotional_safety;safety_stability;participation_access'),
('SC_FOLLOW_THROUGH', 'Social & Community', 'Consistency & Follow-Through', 'CORE', 'Returning to activities, maintaining engagement', 'Sustain participation; reduce drop-out/burnout; build stability', 'Fatigue/overwhelm/fluctuation impact follow-through; support sustains consistency', 'sustain_participation;prevent_regression;daily_living_sustainability'),
('CB_LEARNING_SKILLS', 'Capacity Building', 'Learning & Skill Development', 'CAPACITY_BUILDING', 'Learning computer/daily life skills; guided learning', 'Build skills at a sustainable pace; increase confidence; reduce avoidance', 'Overwhelm/frustration tolerance/cognitive fatigue limits learning; paced support stabilises function so skills can develop', 'capacity_building;reduce_overwhelm;sustain_participation'),
('CB_EMPLOY_PURPOSE', 'Capacity Building', 'Employment & Purpose', 'CAPACITY_BUILDING', 'Work readiness, microbusiness, purposeful routine', 'Build purpose; economic/social participation; sustain routine', 'Consistency/anxiety/burnout/capacity fluctuation barriers; support builds sustainable participation', 'purpose_identity;capacity_building;sustain_participation'),
('CB_EXEC_FUNCTION', 'Capacity Building', 'Cognitive & Executive Function', 'CAPACITY_BUILDING', 'Planning, organising, follow-through, decision making', 'Increase independence and follow-through; reduce paralysis', 'Executive dysfunction/overload impairs initiation/completion; support scaffolds steps and decisions', 'capacity_building;independence;reduce_overwhelm'),
('CB_EMOT_REG', 'Capacity Building', 'Emotional Regulation & Stability', 'CAPACITY_BUILDING', 'Co-regulation, coping, resilience', 'Stabilise mood/response; reduce escalation; increase capacity over time', 'Nervous system regulation/trauma responses affect function; support improves stability and safety', 'emotional_safety;safety_stability;capacity_building'),
('CB_ROUTINE_LIFE_STRUCT', 'Capacity Building', 'Routine, Consistency & Life Structure', 'CAPACITY_BUILDING', 'Habits, routines, consistency', 'Sustain routines; reduce burnout; increase stability', 'Energy fluctuation/burnout/loss of momentum; support stabilises foundation for progress', 'daily_living_sustainability;prevent_regression;capacity_building'),
('CB_HEALTH_WELLBEING', 'Capacity Building', 'Health & Wellbeing', 'CAPACITY_BUILDING', 'Lifestyle stability, stress load, fatigue management', 'Maintain wellbeing; reduce stress load; sustain participation', 'Fatigue/stress reduces capacity; supports conserve energy and maintain health routines', 'health_wellbeing;sustain_participation;daily_living_sustainability'),
('CB_RELATIONSHIPS', 'Capacity Building', 'Relationships & Interpersonal Functioning', 'CAPACITY_BUILDING', 'Communication, boundaries, relational patterns', 'Build safe relationships; improve communication; reduce conflict patterns', 'Trust/safety/emotional regulation barriers; support scaffolds communication and boundary skills', 'belonging_connection;capacity_building;emotional_safety')
ON CONFLICT (support_domain_code) DO UPDATE SET
  ndis_support_domain = EXCLUDED.ndis_support_domain,
  tmg_functional_grouping = EXCLUDED.tmg_functional_grouping,
  ndis_bucket_default = EXCLUDED.ndis_bucket_default,
  includes_examples = EXCLUDED.includes_examples,
  common_goal_links_plain = EXCLUDED.common_goal_links_plain,
  functional_barrier_plain = EXCLUDED.functional_barrier_plain,
  rn_rationale_tags = EXCLUDED.rn_rationale_tags;
