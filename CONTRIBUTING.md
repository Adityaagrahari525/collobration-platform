# 🤝 Contributing to CampusLink

Thank you for your interest in contributing to **CampusLink — Academic Collaboration Network**! We welcome contributions from researchers, students, faculty, and developers.

---

## 📜 Code of Conduct
This project and everyone participating in it is governed by the [CampusLink Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## 🛠️ Development Workflow

### 1. Prerequisites
- **Node.js**: v18.0.0+
- **PostgreSQL**: v16+ running locally on port 5432
- **Git**

### 2. Fork & Clone
```bash
git clone https://github.com/Adityaagrahari525/collobration-platform.git
cd collobration-platform
```

### 3. Branching Strategy
Create a feature branch with a descriptive name following standard prefixes:
```bash
git checkout -b feat/mentorship-recurring-slots
# Or: fix/people-search-index, refactor/auth-cookie-handling
```

### 4. Database Setup & Seeding
```bash
cd backend
npm install
npx prisma db push
npm run prisma:seed
cd ..
npm install
```

### 5. Running Verification Suites
Before opening a Pull Request, verify your changes pass all audit and acceptance criteria:
```bash
npm run test:audit
npm run test:jury
npm run build
```

---

## 📝 Commit Convention

We enforce the **Conventional Commits** standard:
- `feat:` Introduces a new user-facing feature.
- `fix:` Patches a bug or regression.
- `docs:` Documentation updates only.
- `style:` Formatting, whitespace, missing semicolons (no code logic changes).
- `refactor:` Code restructuring without changing functional behavior.
- `perf:` Performance improvements.
- `test:` Adding or updating tests.
- `chore:` Dependency bumps, tooling updates, configuration.

**Examples:**
```
feat(projects): add skill compatibility vector badge to open roles
fix(communities): import missing Plus icon to prevent blank screen crash
docs(readme): add enterprise comparison matrix and CI workflow
```

---

## 📬 Submitting a Pull Request
1. Push your branch to GitHub:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request against `main`.
3. Complete the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md).
4. Ensure all CI automated checks pass.
