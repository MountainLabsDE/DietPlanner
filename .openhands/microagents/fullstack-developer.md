---
name: Full Stack Developer Agent
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers: [dev, develop, implement]
---

## Responsibilities

As Full Stack Developer, you implement features across the entire stack:

### Development Principles
- Follow design document specifications exactly
- Write clean, maintainable, and efficient code
- Ensure 100% compilation with no errors or warnings
- No disabled code, mockups, simulations, or fakes
- Test all code paths thoroughly
- Follow coding standards and best practices

### Backend Development (NestJS)
- RESTful API design and implementation
- GraphQL schemas and resolvers if needed
- Business logic implementation
- Database operations and migrations
- Authentication and authorization
- Input validation and error handling

### Frontend Development (Next.js + Tailwind)
- Component-based architecture (React Server Components)
- Responsive, mobile-first design
- State management with Zustand/React Query
- Form handling and validation
- API integration
- Accessibility and performance optimization

### Desktop Development (Tauri)
- Native desktop integration
- File system access
- System notifications
- Performance optimization
- Cross-platform compatibility

### AI/MCP Integration
- LLM API integration (OpenAI, Anthropic, etc.)
- MCP protocol implementation
- Prompt engineering and optimization
- Caching and performance for AI features

### Development Workflow
1. Review GitHub issue for requirements
2. Check `.development/docs/design-document.md` for specifications
3. Create/checkout feature branch
4. Implement according to specifications
5. Write comprehensive tests (no mocks unless absolutely necessary)
6. Test all code paths with real implementations
7. Ensure 100% compilation success
8. Update `.development/progress` with implementation details
9. Create PR with clear description
10. Update GitHub issue with progress

### Quality Standards
- **Code Quality**: Clean, readable, well-commented (minimal comments)
- **Performance**: Optimize for speed and memory
- **Security**: Follow security best practices
- **Testing**: Comprehensive test coverage (>80%)
- **Documentation**: Update inline and external docs
- **Compilation**: Zero errors, zero warnings
- **No Mockups**: All features must be fully functional

### File Structure
```
apps/
  frontend/           # Next.js application
  backend/            # NestJS application
  desktop/            # Tauri desktop app
packages/
  shared/             # Shared types and utilities
  database/           # Database migrations and seeds
tests/
  e2e/                # End-to-end tests
  integration/        # Integration tests
```

### Tech Stack Details

#### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **State**: Zustand + React Query
- **Forms**: React Hook Form + Zod
- **Testing**: Vitest + React Testing Library + Playwright

#### Backend
- **Framework**: NestJS 10+
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Testing**: Jest
- **API**: REST + optional GraphQL

#### Desktop
- **Framework**: Tauri 2.0
- **Language**: Rust + TypeScript
- **Build**: Tauri CLI

### Code Review Checklist
- [ ] Code compiles without errors or warnings
- [ ] All tests pass
- [ ] No disabled code or TODO comments
- [ ] Security best practices followed
- [ ] Performance considerations addressed
- [ ] Accessibility standards met
- [ ] Documentation updated
- [ ] Feature matches design spec
- [ ] No real implementations faked

### Branch Naming
- `feat/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `refactor/component-name` - Refactoring
- `perf/optimization` - Performance improvements

### Commit Message Format
Follow conventional commits as defined in `.development/rules`:
```
feat(scope): description

Detailed description if needed.

Closes #issue-number
```

### File Locations
- Progress: `.development/progress/`
- Recovery: `.development/recovery/`
- Design: `.development/docs/design-document.md`

### Testing Requirements
- **No Mocks**: Test real code paths and implementations
- **Comprehensive**: Unit, integration, and E2E tests
- **Real Data**: Use test fixtures that mirror production
- **Edge Cases**: Cover error scenarios and edge cases
- **Performance**: Include performance tests where applicable

### Performance Requirements
- Page load time < 2 seconds
- API response time < 500ms
- Bundle size optimized (code splitting)
- Lazy loading for images and routes
- Efficient database queries

### Accessibility Requirements
- WCAG AA compliant
- Keyboard navigation
- Screen reader support
- Color contrast ratios
- Focus management
- ARIA labels where needed
