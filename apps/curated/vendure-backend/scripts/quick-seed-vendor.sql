-- Quick Seed Vendor Profile (assuming user already exists)
-- For test vendor account: vendor@jade-marketplace.test

-- First, check if we have a test vendor user
DO $$
DECLARE
    v_user_count INTEGER;
BEGIN
    -- Check for vendor user
    SELECT COUNT(*) INTO v_user_count FROM jade."user" WHERE email = 'vendor@jade-marketplace.test';

    IF v_user_count = 0 THEN
        RAISE EXCEPTION 'No vendor user found. Please ensure database has been seeded with user data first.';
    END IF;

    RAISE NOTICE 'Found vendor user. Proceeding with vendor profile creation...';
END $$;

-- Now create/update vendor profile for the existing user
DO $$
DECLARE
    v_user_id UUID;
    v_profile_id UUID;
BEGIN
    -- Get user ID
    SELECT id INTO v_user_id FROM jade."user" WHERE email = 'vendor@jade-marketplace.test';

    RAISE NOTICE 'Vendor user ID: %', v_user_id;

    -- Create or update vendor profile
    INSERT INTO jade.vendor_profile
        (vendure_seller_id, company_name, contact_name, contact_email, contact_phone,
         website_url, description, specializations, established_year,
         taxonomy_accuracy_score, product_approval_rate, average_response_time_hours,
         is_active, is_verified, verification_date, onboarding_completed, onboarding_completed_at,
         created_at, updated_at)
    VALUES
        (v_user_id, 'Premium Skincare Co', 'Robert Supplier', 'vendor@jade-marketplace.test', '(800) 555-0300',
         'https://premiumskincare.test',
         'Professional-grade skincare products for spas and clinics. Specializing in clinical treatments and advanced formulations.',
         '["Clinical Skincare", "Professional Treatments", "Anti-Aging", "Medical Grade"]'::jsonb,
         2015, 92, 0.88, 4, true, true, '2024-01-15', true, '2024-01-20', NOW(), NOW())
    ON CONFLICT (vendure_seller_id) DO UPDATE SET
        company_name = EXCLUDED.company_name,
        contact_name = EXCLUDED.contact_name,
        taxonomy_accuracy_score = EXCLUDED.taxonomy_accuracy_score,
        product_approval_rate = EXCLUDED.product_approval_rate,
        updated_at = NOW()
    RETURNING id INTO v_profile_id;

    RAISE NOTICE '✓ Vendor profile created/updated with ID: %', v_profile_id;

    -- Create or update vendor statistics
    INSERT INTO jade.vendor_statistics
        (vendor_profile_id, total_products, active_products, pending_approval_products, rejected_products,
         total_sales_amount, monthly_sales_amount, yearly_sales_amount, total_orders, average_order_value,
         total_customers, repeat_customers, customer_retention_rate,
         products_with_complete_taxonomy, products_with_protocols, professional_products,
         calculated_at, period_start_date, period_end_date, created_at, updated_at)
    VALUES
        (v_profile_id, 45, 38, 3, 4,
         1245000, 285000, 2890000, 156, 7980,
         89, 62, 69.7,
         41, 35, 42,
         NOW(), '2024-01-01', '2024-12-31', NOW(), NOW())
    ON CONFLICT (vendor_profile_id) DO UPDATE SET
        total_products = EXCLUDED.total_products,
        active_products = EXCLUDED.active_products,
        pending_approval_products = EXCLUDED.pending_approval_products,
        monthly_sales_amount = EXCLUDED.monthly_sales_amount,
        updated_at = NOW();

    RAISE NOTICE '✓ Vendor statistics created/updated';

    -- Create or update vendor quality metrics
    INSERT INTO jade.vendor_quality_metrics
        (vendor_profile_id, correct_category_assignments, incorrect_category_assignments,
         correct_function_assignments, incorrect_function_assignments,
         protocols_provided, protocols_missing, protocol_quality_score,
         high_quality_images, low_quality_images, missing_images,
         complete_descriptions, incomplete_descriptions, description_quality_score,
         compliant_products, non_compliant_products, overall_quality_score,
         period_start_date, period_end_date, calculated_at, created_at, updated_at)
    VALUES
        (v_profile_id, 41, 4, 39, 6,
         35, 10, 87,
         40, 3, 2,
         43, 2, 94,
         43, 2, 89,
         '2024-01-01', '2024-12-31', NOW(), NOW(), NOW())
    ON CONFLICT (vendor_profile_id) DO UPDATE SET
        overall_quality_score = EXCLUDED.overall_quality_score,
        protocol_quality_score = EXCLUDED.protocol_quality_score,
        description_quality_score = EXCLUDED.description_quality_score,
        updated_at = NOW();

    RAISE NOTICE '✓ Vendor quality metrics created/updated';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Vendor profile setup complete!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'You can now log in with:';
    RAISE NOTICE '  Email: vendor@jade-marketplace.test';
    RAISE NOTICE '  Password: Vendor123!';
    RAISE NOTICE '  Dashboard: /app/vendor/dashboard';
    RAISE NOTICE '========================================';
END $$;
