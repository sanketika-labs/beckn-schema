# WorkOpportunityItem Schema Design Document

## 1. Job Position Analysis

Before designing the generic WorkOpportunityItem schema, the following four job positions were thoroughly analyzed to identify common patterns and requirements:

### 1.1 Analyzed Job Positions

1. **Mechanic Job**
   - **Source**: [Mechanic Provider Schema](https://raw.githubusercontent.com/dhiway/schema/refs/heads/main/onest-work-opportunity/mechanic-provider.json)
   - **Focus**: Automotive and mechanical repair work
   - **Key Requirements**: Vehicle types, tools, certifications, diagnostic skills

2. **Machine Operator Job**
   - **Source**: [Machine Operator Provider Schema](https://raw.githubusercontent.com/dhiway/schema/refs/heads/main/onest-work-opportunity/machine-operator-provider.json)
   - **Focus**: Industrial machinery operation and production
   - **Key Requirements**: Machine types, safety certifications, operating procedures

3. **Industrial Tailor Job**
   - **Source**: [Industrial Tailor Provider Schema](https://raw.githubusercontent.com/dhiway/schema/refs/heads/main/onest-work-opportunity/industrial-tailor-provider.json)
   - **Focus**: Garment manufacturing and industrial sewing
   - **Key Requirements**: Fabric knowledge, measurement skills, industrial machinery

4. **Tele Sales Person Job**
   - **Source**: [Tele Sales Person Provider Schema](https://raw.githubusercontent.com/dhiway/schema/refs/heads/main/onest-work-opportunity/tele-sales-person-provider.json)
   - **Focus**: Remote sales and customer relationship management
   - **Key Requirements**: Communication skills, sales targets, product knowledge

### 1.2 Analysis Findings

Through this analysis, a consistent three-section pattern was identified across all job types:

1. **basicInfo** - Company/Provider information (employer details, location, branding)
2. **jobDetails** - Job-specific requirements and details (title, description, salary, hours)
3. **jobNeeds** - Candidate requirements and qualifications (age, gender, education, skills)

This pattern formed the foundation for the generic WorkOpportunityItem schema design, ensuring it could accommodate diverse job types while maintaining consistency and extensibility.

---

## 2. Schema Design Decisions

### 2.1 Property Mapping Strategy

**From basicInfo (Original JSON Properties):**
- `jobProviderName` → `work:employerName` (schema:Organization)
  - **Original**: Company/business name as simple string
  - **New**: Full Organization entity with name, URL, logo, etc.
  - **Schema.org**: Uses `schema:Organization` for rich employer representation
- `jobProviderType` → `work:employerType` (schema:Text)
  - **Original**: Simple string like "corporation", "startup", "government"
  - **New**: Standardized text with enum validation
  - **Schema.org**: Uses `schema:Text` instead of custom `work:EmployerType`
- `jobProviderLocation` → `work:workLocation` (schema:Place)
  - **Original**: Simple location object with city, state, country
  - **New**: Rich location using `schema:Place` with `schema:PostalAddress`
  - **Schema.org**: Uses `schema:Place` instead of `beckn:Location`
- `jobProviderLogo` → `work:employerLogo` (schema:Image)
  - **Original**: Simple image URL string
  - **New**: Full `schema:Image` entity with URL, alt text, dimensions
  - **Schema.org**: Uses `schema:Image` for proper media representation

**From jobDetails (Original JSON Properties):**
- `title` → `work:jobTitle` (schema:Text)
  - **Original**: Simple job title string
  - **New**: Standardized job title using `schema:Text`
  - **Schema.org**: Maps to `schema:title` in JobPosting microdata
- `designation` → `work:jobDesignation` (schema:Text)
  - **Original**: Official role designation string
  - **New**: Standardized text instead of custom `work:JobDesignation`
  - **Schema.org**: Uses `schema:Text` for flexible content
- `jobDescription` → `work:jobDescription` (schema:Text)
  - **Original**: Detailed job description string
  - **New**: Standardized description using `schema:Text`
  - **Schema.org**: Maps to `schema:description` in JobPosting microdata
- `minMonthlyInHand` → `work:salaryMin` (schema:MonetaryAmount)
  - **Original**: Simple numeric value for minimum salary
  - **New**: Rich `schema:MonetaryAmount` with value and currency
  - **Schema.org**: Uses `schema:MonetaryAmount` instead of `beckn:Price`
- `maxMonthlyInHand` → `work:salaryMax` (schema:MonetaryAmount)
  - **Original**: Simple numeric value for maximum salary
  - **New**: Rich `schema:MonetaryAmount` with value and currency
  - **Schema.org**: Uses `schema:MonetaryAmount` instead of `beckn:Price`
- `workingHoursPerDay` → `work:workingHours` (schema:Duration)
  - **Original**: Simple numeric hours per day
  - **New**: Standardized `schema:Duration` for time representation
  - **Schema.org**: Maps to `schema:workHours` in JobPosting microdata
- `jobType` → `work:employmentType` (schema:Text)
  - **Original**: Simple string like "full-time", "part-time"
  - **New**: Standardized text instead of custom `work:EmploymentType`
  - **Schema.org**: Maps to `schema:employmentType` in JobPosting microdata
- `modeOfWork` → `work:workMode` (schema:Text)
  - **Original**: Simple string like "onsite", "remote", "hybrid"
  - **New**: Standardized text instead of custom `work:WorkMode`
  - **Schema.org**: Uses `schema:Text` for flexible work mode representation

**From jobNeeds (Original JSON Properties):**
- `ageAllowedLowerLimit` → `work:ageMin` (schema:Number)
  - **Original**: Simple numeric minimum age requirement
  - **New**: Standardized `schema:Number` for age validation
  - **Schema.org**: Uses `schema:Number` for numeric constraints
- `ageAllowedUpperLimit` → `work:ageMax` (schema:Number)
  - **Original**: Simple numeric maximum age requirement
  - **New**: Standardized `schema:Number` for age validation
  - **Schema.org**: Uses `schema:Number` for numeric constraints
- `genderPreference` → `work:genderPreference` (schema:Text)
  - **Original**: Simple string like "male", "female", "any"
  - **New**: Standardized text instead of custom `work:GenderPreference`
  - **Schema.org**: Uses `schema:Text` with enum validation
- `educationSubsection` → `work:educationRequirements` (schema:Text)
  - **Original**: Complex nested object with education details
  - **New**: Standardized text instead of custom `work:EducationRequirement`
  - **Schema.org**: Uses `schema:Text` for flexible education content
- `languagesSubsection` → `work:languageRequirements` (schema:Text)
  - **Original**: Complex nested object with language details
  - **New**: Standardized text instead of custom `work:LanguageRequirement`
  - **Schema.org**: Uses `schema:Text` for flexible language content

### 2.2 New Work-Specific Properties (Enhanced with Schema.org)
- `work:applicationDeadline` (schema:Date)
  - **New Property**: Application submission deadline
  - **Schema.org**: Uses `schema:Date` for proper date validation
- `work:startDate` (schema:Date)
  - **New Property**: Expected job start date
  - **Schema.org**: Uses `schema:Date` for proper date validation
- `work:contractDuration` (schema:Duration)
  - **New Property**: Length of employment contract
  - **Schema.org**: Uses `schema:Duration` for time representation
- `work:benefits` (schema:Text)
  - **New Property**: Benefits and perks offered
  - **Schema.org**: Uses `schema:Text` instead of custom `work:BenefitPackage`
- `work:skills` (schema:Text)
  - **New Property**: Required skills and competencies
  - **Schema.org**: Uses `schema:Text` instead of custom `work:SkillRequirement`
- `work:experience` (schema:Text)
  - **New Property**: Work experience requirements
  - **Schema.org**: Uses `schema:Text` instead of custom `work:ExperienceRequirement`
- `work:certifications` (schema:Text)
  - **New Property**: Required professional certifications
  - **Schema.org**: Uses `schema:Text` instead of custom `work:CertificationRequirement`
- `work:positions` (schema:Number)
  - **New Property**: Number of open positions
  - **Schema.org**: Uses `schema:Number` for numeric representation
- `work:hiringUrgency` (schema:Text)
  - **New Property**: Level of urgency for filling position
  - **Schema.org**: Uses `schema:Text` instead of custom `work:HiringUrgency`
- `work:validTill` (schema:Date)
  - **New Property**: Job posting validity period
  - **Schema.org**: Uses `schema:Date` for proper date validation

### 2.3 Complete Property Mapping Table

| Original JSON Property | New Work Property | Schema.org Entity | Transformation Type | Benefits |
|------------------------|-------------------|-------------------|-------------------|----------|
| **basicInfo Section** |
| `jobProviderName` | `work:employerName` | `schema:Organization` | Simple string → Rich entity | Rich employer representation |
| `jobProviderType` | `work:employerType` | `schema:Text` | Custom type → Standard text | Enum validation, flexibility |
| `jobProviderLocation` | `work:workLocation` | `schema:Place` | Beckn Location → Schema Place | Standard location format |
| `jobProviderLogo` | `work:employerLogo` | `schema:Image` | Simple URL → Rich image | Proper media representation |
| **jobDetails Section** |
| `title` | `work:jobTitle` | `schema:Text` | Simple string → Standard text | Maps to JobPosting.title |
| `designation` | `work:jobDesignation` | `schema:Text` | Custom type → Standard text | Flexible content, enum validation |
| `jobDescription` | `work:jobDescription` | `schema:Text` | Simple string → Standard text | Maps to JobPosting.description |
| `minMonthlyInHand` | `work:salaryMin` | `schema:MonetaryAmount` | Simple number → Rich entity | Currency, validation, rich data |
| `maxMonthlyInHand` | `work:salaryMax` | `schema:MonetaryAmount` | Simple number → Rich entity | Currency, validation, rich data |
| `workingHoursPerDay` | `work:workingHours` | `schema:Duration` | Simple number → Duration | Standard time representation |
| `jobType` | `work:employmentType` | `schema:Text` | Custom type → Standard text | Maps to JobPosting.employmentType |
| `modeOfWork` | `work:workMode` | `schema:Text` | Custom type → Standard text | Flexible work mode representation |
| **jobNeeds Section** |
| `ageAllowedLowerLimit` | `work:ageMin` | `schema:Number` | Simple number → Standard number | Numeric validation |
| `ageAllowedUpperLimit` | `work:ageMax` | `schema:Number` | Simple number → Standard number | Numeric validation |
| `genderPreference` | `work:genderPreference` | `schema:Text` | Custom type → Standard text | Enum validation, flexibility |
| `educationSubsection` | `work:educationRequirements` | `schema:Text` | Complex object → Standard text | Simplified, flexible content |
| `languagesSubsection` | `work:languageRequirements` | `schema:Text` | Complex object → Standard text | Simplified, flexible content |
| **New Properties** |
| - | `work:applicationDeadline` | `schema:Date` | New property | Proper date validation |
| - | `work:startDate` | `schema:Date` | New property | Proper date validation |
| - | `work:contractDuration` | `schema:Duration` | New property | Standard time representation |
| - | `work:benefits` | `schema:Text` | New property | Flexible benefits description |
| - | `work:skills` | `schema:Text` | New property | Flexible skills description |
| - | `work:experience` | `schema:Text` | New property | Flexible experience description |
| - | `work:certifications` | `schema:Text` | New property | Flexible certifications description |
| - | `work:positions` | `schema:Number` | New property | Numeric position count |
| - | `work:hiringUrgency` | `schema:Text` | New property | Enum validation, flexibility |
| - | `work:validTill` | `schema:Date` | New property | Proper date validation |

### 2.4 Schema.org Integration Benefits

#### 2.4.1 Microdata Generation
The transformed properties now generate perfect schema.org microdata:
```html
<div itemscope itemtype="https://schema.org/JobPosting">
  <h1 itemprop="title">{{work:jobTitle}}</h1>
  <div itemprop="hiringOrganization">{{work:employerName}}</div>
  <div itemprop="jobLocation">{{work:workLocation}}</div>
  <div itemprop="baseSalary">{{work:salaryMin}} - {{work:salaryMax}}</div>
  <div itemprop="employmentType">{{work:employmentType}}</div>
  <div itemprop="workHours">{{work:workingHours}}</div>
  <div itemprop="description">{{work:jobDescription}}</div>
</div>
```