/**
 * ==========================================================================
 * RAILWAY STATION FACILITY NAVIGATION AND ACCESSIBILITY WEB SYSTEM
 * Core Application Logic, Graph Routing Engine & Interactive SVG Map
 * ==========================================================================
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. SAMPLE DATA STRUCTURES: STATION GRAPH NODES & CONNECTIONS
     ========================================================================== */

  /**
   * Station Nodes - Represents all physical facilities, platforms, and transit junctions.
   * Coordinate system based on SVG viewBox 0 0 1000 650.
   */
  const stationNodes = [
    {
      id: 'main_entrance',
      name: 'Main Entrance',
      mapLabel: 'Main Entrance',
      mapSublabel: 'City Entry',
      category: 'entrances',
      categoryLabel: 'Entrances & Exits',
      level: 'Ground Concourse',
      x: 340,
      y: 575,
      iconType: 'door',
      accessibility: {
        isWheelchairAccessible: true,
        tactilePaving: true,
        audioAssistance: true,
        brailleSignage: true,
        notes: 'Wide automatic sliding doors with zero-step threshold and guide tactile paving.'
      },
      description: 'Primary station gateway connecting the city forecourt to the central ticketing and concourse area.'
    },
    {
      id: 'exit_gate',
      name: 'Exit Gate',
      mapLabel: 'Exit Gate',
      mapSublabel: 'Way Out',
      category: 'entrances',
      categoryLabel: 'Entrances & Exits',
      level: 'Ground Concourse',
      x: 700,
      y: 575,
      iconType: 'door',
      accessibility: {
        isWheelchairAccessible: true,
        tactilePaving: true,
        audioAssistance: false,
        brailleSignage: true,
        notes: 'Step-free wide automated turnstiles and accessible dedicated gate with ramp to parking.'
      },
      description: 'Dedicated one-way exit terminal leading to prepaid taxi stands, auto-rickshaws, and public transport.'
    },
    {
      id: 'ticket_counter',
      name: 'Ticket Counter & Booking Office',
      mapLabel: 'Ticket Counter',
      mapSublabel: 'Booking',
      category: 'ticketing',
      categoryLabel: 'Ticketing',
      level: 'Ground Concourse',
      x: 160,
      y: 495,
      iconType: 'ticket',
      accessibility: {
        isWheelchairAccessible: true,
        tactilePaving: true,
        audioAssistance: true,
        brailleSignage: true,
        notes: 'Includes Counter #1 lowered at 75cm for wheelchair passengers and equipped with hearing loop.'
      },
      description: 'Manned passenger reservation booths, unreserved ticketing counters, and self-service touch ATVM kiosks.'
    },
    {
      id: 'waiting_hall',
      name: 'Waiting Hall & Executive Lounge',
      mapLabel: 'Waiting Hall',
      mapSublabel: 'AC Lounge',
      category: 'passenger_assistance',
      categoryLabel: 'Passenger Assistance',
      level: 'Ground Concourse',
      x: 160,
      y: 385,
      iconType: 'waiting',
      accessibility: {
        isWheelchairAccessible: true,
        tactilePaving: true,
        audioAssistance: true,
        brailleSignage: true,
        notes: 'Reserved priority seating for elderly and disabled travelers, air-conditioned with charging ports.'
      },
      description: 'Spacious passenger waiting area with live train departure display screens and charging points.'
    },
    {
      id: 'first_aid',
      name: 'Medical Room & First Aid',
      mapLabel: 'Medical Room',
      mapSublabel: 'First Aid',
      category: 'passenger_assistance',
      categoryLabel: 'Passenger Assistance',
      level: 'Ground Concourse',
      x: 330,
      y: 465,
      iconType: 'aid',
      accessibility: {
        isWheelchairAccessible: true,
        tactilePaving: true,
        audioAssistance: true,
        brailleSignage: true,
        notes: 'Fully step-free emergency room with paramedic on duty, emergency stretchers, and wheelchairs.'
      },
      description: 'Emergency healthcare booth equipped with first aid kits, automated defibrillator (AED), and wheelchairs.'
    },
    {
      id: 'info_desk',
      name: 'Information & Help Desk',
      mapLabel: 'Info Desk',
      mapSublabel: 'Help Center',
      category: 'passenger_assistance',
      categoryLabel: 'Passenger Assistance',
      level: 'Ground Concourse',
      x: 450,
      y: 465,
      iconType: 'info',
      accessibility: {
        isWheelchairAccessible: true,
        tactilePaving: true,
        audioAssistance: true,
        brailleSignage: true,
        notes: 'Help desk staff trained in sign language; provides free wheelchair assistance on request.'
      },
      description: 'Central customer inquiry point for train announcements, platform verification, and special assistance.'
    },
    {
      id: 'concourse_central',
      name: 'Concourse Central Junction',
      mapLabel: 'Central Concourse',
      mapSublabel: 'Main Hub',
      category: 'passenger_assistance',
      categoryLabel: 'Concourse Junction',
      level: 'Ground Concourse',
      x: 520,
      y: 415,
      iconType: 'junction',
      accessibility: {
        isWheelchairAccessible: true,
        tactilePaving: true,
        audioAssistance: true,
        brailleSignage: false,
        notes: 'Spacious flat concourse hub interconnecting all ground facilities and platform bridges.'
      },
      description: 'Main pedestrian crossroads of the terminal providing access to Platform 1 and the Foot Overbridge.'
    },
    {
      id: 'cloak_room',
      name: 'Cloak Room & Luggage Counter',
      mapLabel: 'Cloak Room',
      mapSublabel: 'Baggage',
      category: 'passenger_assistance',
      categoryLabel: 'Passenger Assistance',
      level: 'Ground Concourse',
      x: 670,
      y: 465,
      iconType: 'luggage',
      accessibility: {
        isWheelchairAccessible: true,
        tactilePaving: false,
        audioAssistance: false,
        brailleSignage: true,
        notes: 'Level access counter for luggage scanning, parcel holding, and trolley assistance.'
      },
      description: 'Secure 24/7 baggage storage facility and lost-property reclamation desk.'
    },
    {
      id: 'food_court',
      name: 'Food Court & Refreshments',
      mapLabel: 'Food Court',
      mapSublabel: 'Dining',
      category: 'food',
      categoryLabel: 'Food & Refreshments',
      level: 'Ground Concourse',
      x: 840,
      y: 435,
      iconType: 'food',
      accessibility: {
        isWheelchairAccessible: true,
        tactilePaving: true,
        audioAssistance: false,
        brailleSignage: false,
        notes: 'Wide aisles between seating with wheelchair-friendly movable dining tables and water cooler.'
      },
      description: 'Selection of eateries, hygienic packaged meals, coffee stalls, and purified drinking water fountains.'
    },
    {
      id: 'restrooms',
      name: 'Restrooms & Accessible Toilet',
      mapLabel: 'Restrooms',
      mapSublabel: 'WC & Divyang',
      category: 'restrooms',
      categoryLabel: 'Restrooms',
      level: 'Ground Concourse',
      x: 840,
      y: 535,
      iconType: 'restroom',
      accessibility: {
        isWheelchairAccessible: true,
        tactilePaving: true,
        audioAssistance: false,
        brailleSignage: true,
        notes: 'Includes dedicated ADA-compliant unisex accessible restroom with grab bars and emergency pull cord.'
      },
      description: 'Modern sanitary facilities with separate Gents, Ladies, and Divyangjan-friendly accessible restroom.'
    },
    {
      id: 'platform_1',
      name: 'Platform 1',
      mapLabel: 'Platform 1',
      mapSublabel: 'Ground Level',
      category: 'platforms',
      categoryLabel: 'Platforms',
      level: 'Ground Level',
      x: 240,
      y: 285,
      iconType: 'train',
      accessibility: {
        isWheelchairAccessible: true,
        tactilePaving: true,
        audioAssistance: true,
        brailleSignage: true,
        notes: 'Direct level walk from Concourse. Zero stairs or elevators needed. Tactile warning edge installed.'
      },
      description: 'Main express train departure platform with seamless level access directly from the concourse.'
    },
    {
      id: 'fob_stairs_concourse',
      name: 'Concourse Stairs to Overbridge',
      mapLabel: 'Bridge Stairs',
      mapSublabel: 'Steps Only',
      category: 'accessibility',
      categoryLabel: 'Station Transition',
      level: 'Ground to Bridge',
      x: 430,
      y: 350,
      iconType: 'stairs',
      accessibility: {
        isWheelchairAccessible: false,
        tactilePaving: true,
        audioAssistance: false,
        brailleSignage: false,
        notes: 'Warning: 28 concrete steps. Strictly NOT accessible for wheelchairs or heavy wheeled luggage.'
      },
      description: 'Rapid stair climb connecting the ground concourse directly to the Foot Overbridge.'
    },
    {
      id: 'fob_lift_concourse',
      name: 'Concourse Lift (Elevator)',
      mapLabel: 'Bridge Lift',
      mapSublabel: 'Elevator',
      category: 'accessibility',
      categoryLabel: 'Accessibility Facilities',
      level: 'Ground to Bridge',
      x: 520,
      y: 350,
      iconType: 'lift',
      accessibility: {
        isWheelchairAccessible: true,
        tactilePaving: true,
        audioAssistance: true,
        brailleSignage: true,
        notes: 'High-capacity glass elevator with voice floor readout, low Braille buttons, and auto doors.'
      },
      description: 'Priority motorized elevator linking the concourse to the elevated Foot Overbridge.'
    },
    {
      id: 'fob_ramp_concourse',
      name: 'Concourse Accessible Ramp',
      mapLabel: 'Bridge Ramp',
      mapSublabel: 'Step-Free',
      category: 'accessibility',
      categoryLabel: 'Accessibility Facilities',
      level: 'Ground to Bridge',
      x: 610,
      y: 350,
      iconType: 'ramp',
      accessibility: {
        isWheelchairAccessible: true,
        tactilePaving: true,
        audioAssistance: false,
        brailleSignage: true,
        notes: 'Gentle 1:12 standardized gradient ramp with dual handrails and non-slip rubberized flooring.'
      },
      description: 'Wheelchair-friendly sloped walkway ascending smoothly to the Foot Overbridge without steps.'
    },
    {
      id: 'foot_overbridge',
      name: 'Foot Overbridge (FOB Walkway)',
      mapLabel: 'Foot Overbridge',
      mapSublabel: 'Cross-Track Span',
      category: 'accessibility',
      categoryLabel: 'Elevated Overbridge',
      level: 'Elevated Level',
      x: 520,
      y: 220,
      iconType: 'bridge',
      accessibility: {
        isWheelchairAccessible: true,
        tactilePaving: true,
        audioAssistance: true,
        brailleSignage: true,
        notes: 'Completely flat elevated pedestrian bridge spanning across Tracks 1 & 2.'
      },
      description: 'Covered elevated bridge spanning rail tracks to connect Platform 1 to Island Platforms 2 & 3.'
    },
    {
      id: 'fob_stairs_platform_2_3',
      name: 'FOB Stairs to Platform 2 & 3',
      mapLabel: 'P2/P3 Stairs',
      mapSublabel: 'Steps Only',
      category: 'accessibility',
      categoryLabel: 'Station Transition',
      level: 'Bridge to Island Platform',
      x: 430,
      y: 125,
      iconType: 'stairs',
      accessibility: {
        isWheelchairAccessible: false,
        tactilePaving: true,
        audioAssistance: false,
        brailleSignage: false,
        notes: 'Warning: 28 concrete steps. Not suitable for wheelchair users or mobility scooters.'
      },
      description: 'Direct stairway descent leading down from the Foot Overbridge to Platform 2 & 3.'
    },
    {
      id: 'fob_lift_platform_2_3',
      name: 'Platform 2 & 3 Lift (Elevator)',
      mapLabel: 'P2/P3 Lift',
      mapSublabel: 'Elevator',
      category: 'accessibility',
      categoryLabel: 'Accessibility Facilities',
      level: 'Bridge to Island Platform',
      x: 520,
      y: 125,
      iconType: 'lift',
      accessibility: {
        isWheelchairAccessible: true,
        tactilePaving: true,
        audioAssistance: true,
        brailleSignage: true,
        notes: 'Dedicated passenger elevator descending to the middle of Island Platform 2 and 3.'
      },
      description: 'Wheelchair accessible elevator serving passengers moving between the bridge and Platforms 2 & 3.'
    },
    {
      id: 'fob_ramp_platform_2_3',
      name: 'Platform 2 & 3 Ramp',
      mapLabel: 'P2/P3 Ramp',
      mapSublabel: 'Step-Free',
      category: 'accessibility',
      categoryLabel: 'Accessibility Facilities',
      level: 'Bridge to Island Platform',
      x: 610,
      y: 125,
      iconType: 'ramp',
      accessibility: {
        isWheelchairAccessible: true,
        tactilePaving: true,
        audioAssistance: false,
        brailleSignage: true,
        notes: 'Standard 1:12 continuous ramp connecting bridge to the island platform surface.'
      },
      description: 'Step-free gentle ramp allowing seamless descent onto Island Platforms 2 & 3.'
    },
    {
      id: 'platform_2',
      name: 'Platform 2',
      mapLabel: 'Platform 2',
      mapSublabel: 'South Track',
      category: 'platforms',
      categoryLabel: 'Platforms',
      level: 'Island Platform Level',
      x: 220,
      y: 130,
      iconType: 'train',
      accessibility: {
        isWheelchairAccessible: true,
        tactilePaving: true,
        audioAssistance: true,
        brailleSignage: true,
        notes: 'Island platform with tactile hazard strips along track edge; accessible via Lift and Ramp.'
      },
      description: 'Major platform catering to interstate superfast and express trains on Track 1.'
    },
    {
      id: 'platform_3',
      name: 'Platform 3',
      mapLabel: 'Platform 3',
      mapSublabel: 'North Track',
      category: 'platforms',
      categoryLabel: 'Platforms',
      level: 'Island Platform Level',
      x: 820,
      y: 130,
      iconType: 'train',
      accessibility: {
        isWheelchairAccessible: true,
        tactilePaving: true,
        audioAssistance: true,
        brailleSignage: true,
        notes: 'Island platform with tactile hazard strips; accessible via Lift and Ramp from FOB.'
      },
      description: 'Island platform catering to suburban commuter and outbound mail trains on Track 2.'
    }
  ];

  /**
   * Station Graph Connections (Edges)
   * Defines walkable routes between nodes with distance in meters, accessibility flags, and structural characteristics.
   */
  const stationEdges = [
    // Entrance connections
    { from: 'main_entrance', to: 'ticket_counter', distance: 30, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Level tiled floor path to ticketing counters' },
    { from: 'main_entrance', to: 'waiting_hall', distance: 35, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Direct wide corridor towards the waiting lounge' },
    { from: 'main_entrance', to: 'first_aid', distance: 20, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Straight passage past the security checkpoint' },
    { from: 'main_entrance', to: 'info_desk', distance: 25, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Central guide path towards station information kiosk' },
    { from: 'main_entrance', to: 'concourse_central', distance: 35, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Broad concourse corridor leading to train gates' },

    // Ticketing and Waiting Hall
    { from: 'ticket_counter', to: 'waiting_hall', distance: 20, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Short indoor walkway alongside ticket windows' },
    { from: 'ticket_counter', to: 'first_aid', distance: 25, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Level concourse passage' },
    { from: 'waiting_hall', to: 'first_aid', distance: 25, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Corridor connecting waiting lounge to medical booth' },
    { from: 'waiting_hall', to: 'platform_1', distance: 30, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Direct doorway from waiting hall to Platform 1' },

    // Concourse & Central Hub
    { from: 'first_aid', to: 'info_desk', distance: 18, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Open concourse path' },
    { from: 'info_desk', to: 'concourse_central', distance: 15, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Main walkway into central concourse junction' },
    { from: 'concourse_central', to: 'platform_1', distance: 22, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Step-free level walk right onto Platform 1' },
    { from: 'concourse_central', to: 'fob_stairs_concourse', distance: 15, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Walkway to Foot Overbridge stairs' },
    { from: 'concourse_central', to: 'fob_lift_concourse', distance: 15, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Step-free direct approach to Concourse Elevator' },
    { from: 'concourse_central', to: 'fob_ramp_concourse', distance: 18, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Tactile guided approach to the Concourse Ramp' },
    { from: 'concourse_central', to: 'cloak_room', distance: 30, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Eastward concourse passage' },
    { from: 'concourse_central', to: 'food_court', distance: 40, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Spacious food hall entrance corridor' },

    // East concourse: Luggage, Food Court, Restrooms, Exit Gate
    { from: 'cloak_room', to: 'restrooms', distance: 25, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Level passage to restroom facilities' },
    { from: 'cloak_room', to: 'exit_gate', distance: 20, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Short walk directly to the station exit gate' },
    { from: 'food_court', to: 'restrooms', distance: 20, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Direct pathway from dining hall to restrooms' },
    { from: 'restrooms', to: 'exit_gate', distance: 25, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Clear signposted path to exit gate' },
    { from: 'food_court', to: 'fob_ramp_concourse', distance: 35, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Walkway from food court to bridge ramp' },

    // Transitions from Concourse to Elevated Foot Overbridge
    // 1. STAIRS (Inaccessible to wheelchairs)
    { from: 'fob_stairs_concourse', to: 'foot_overbridge', distance: 25, isAccessible: false, hasStairs: true, isRamp: false, isLift: false, desc: 'Ascend 28 stairs to Foot Overbridge (Not Wheelchair Accessible)' },
    // 2. LIFT (Wheelchair accessible)
    { from: 'fob_lift_concourse', to: 'foot_overbridge', distance: 12, isAccessible: true, hasStairs: false, isRamp: false, isLift: true, desc: 'Take Concourse Elevator up to Foot Overbridge' },
    // 3. RAMP (Wheelchair accessible)
    { from: 'fob_ramp_concourse', to: 'foot_overbridge', distance: 32, isAccessible: true, hasStairs: false, isRamp: true, isLift: false, desc: 'Ascend gentle accessible ramp to Foot Overbridge' },

    // Foot Overbridge to Island Platform 2 & 3 Transitions
    // 1. STAIRS (Inaccessible to wheelchairs)
    { from: 'foot_overbridge', to: 'fob_stairs_platform_2_3', distance: 25, isAccessible: false, hasStairs: true, isRamp: false, isLift: false, desc: 'Descend 28 stairs down to Platforms 2 & 3 (Not Wheelchair Accessible)' },
    // 2. LIFT (Wheelchair accessible)
    { from: 'foot_overbridge', to: 'fob_lift_platform_2_3', distance: 12, isAccessible: true, hasStairs: false, isRamp: false, isLift: true, desc: 'Take Elevator down to Platforms 2 & 3' },
    // 3. RAMP (Wheelchair accessible)
    { from: 'foot_overbridge', to: 'fob_ramp_platform_2_3', distance: 32, isAccessible: true, hasStairs: false, isRamp: true, isLift: false, desc: 'Descend gentle accessible ramp to Platforms 2 & 3' },

    // Island Platform 2 & 3 Distribution Walkways
    { from: 'fob_stairs_platform_2_3', to: 'platform_2', distance: 20, isAccessible: false, hasStairs: false, isRamp: false, isLift: false, desc: 'Walk west towards Platform 2 boarding area' },
    { from: 'fob_stairs_platform_2_3', to: 'platform_3', distance: 25, isAccessible: false, hasStairs: false, isRamp: false, isLift: false, desc: 'Walk east towards Platform 3 boarding area' },

    { from: 'fob_lift_platform_2_3', to: 'platform_2', distance: 18, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Exit elevator and head west on level platform to Platform 2' },
    { from: 'fob_lift_platform_2_3', to: 'platform_3', distance: 20, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Exit elevator and head east on level platform to Platform 3' },

    { from: 'fob_ramp_platform_2_3', to: 'platform_2', distance: 24, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Exit ramp and proceed west on flat surface to Platform 2' },
    { from: 'fob_ramp_platform_2_3', to: 'platform_3', distance: 18, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Exit ramp and proceed east on flat surface to Platform 3' },

    // Connecting Platform 2 & 3 along the island platform walkway
    { from: 'platform_2', to: 'platform_3', distance: 35, isAccessible: true, hasStairs: false, isRamp: false, isLift: false, desc: 'Level platform walkway between Platform 2 and Platform 3' }
  ];

  /* ==========================================================================
     2. GRAPH DATA STRUCTURE & ROUTING ENGINE
     ========================================================================== */

  const graph = {};

  stationNodes.forEach(node => {
    graph[node.id] = [];
  });

  stationEdges.forEach(edge => {
    // Forward edge
    if (graph[edge.from]) {
      graph[edge.from].push({
        to: edge.to,
        distance: edge.distance,
        isAccessible: edge.isAccessible,
        hasStairs: edge.hasStairs,
        isRamp: edge.isRamp,
        isLift: edge.isLift,
        desc: edge.desc
      });
    }

    // Bidirectional reverse edge
    if (graph[edge.to]) {
      let reverseDesc = edge.desc;
      if (edge.desc.includes('Ascend')) {
        reverseDesc = edge.desc.replace('Ascend', 'Descend');
      } else if (edge.desc.includes('Descend')) {
        reverseDesc = edge.desc.replace('Descend', 'Ascend');
      } else if (edge.desc.includes('up to')) {
        reverseDesc = edge.desc.replace('up to', 'down from');
      } else if (edge.desc.includes('down to')) {
        reverseDesc = edge.desc.replace('down to', 'up from');
      }

      graph[edge.to].push({
        to: edge.from,
        distance: edge.distance,
        isAccessible: edge.isAccessible,
        hasStairs: edge.hasStairs,
        isRamp: edge.isRamp,
        isLift: edge.isLift,
        desc: reverseDesc
      });
    }
  });

  /**
   * Dijkstra's Shortest Path Algorithm
   */
  function findShortestRoute(startId, destinationId, wheelchairOnly = false) {
    if (startId === destinationId) {
      return { success: false, reason: 'same_location', message: 'Starting point and destination cannot be identical.' };
    }

    if (!graph[startId] || !graph[destinationId]) {
      return { success: false, reason: 'invalid_node', message: 'Selected location is invalid.' };
    }

    const distances = {};
    const previous = {};
    const visited = new Set();
    const queue = [];

    stationNodes.forEach(node => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
    });

    distances[startId] = 0;
    queue.push({ id: startId, dist: 0 });

    while (queue.length > 0) {
      queue.sort((a, b) => a.dist - b.dist);
      const current = queue.shift();

      if (visited.has(current.id)) continue;
      visited.add(current.id);

      if (current.id === destinationId) break;

      const neighbors = graph[current.id] || [];
      for (const edge of neighbors) {
        // Enforce Accessibility Filter
        if (wheelchairOnly) {
          if (edge.hasStairs || !edge.isAccessible) {
            continue; // Skip stairs or inaccessible segments!
          }
        }

        const altDist = distances[current.id] + edge.distance;
        if (altDist < distances[edge.to]) {
          distances[edge.to] = altDist;
          previous[edge.to] = { from: current.id, edge: edge };
          queue.push({ id: edge.to, dist: altDist });
        }
      }
    }

    if (distances[destinationId] === Infinity) {
      if (wheelchairOnly) {
        const testStandard = findShortestRoute(startId, destinationId, false);
        if (testStandard.success) {
          return {
            success: false,
            reason: 'no_accessible_path',
            message: 'No step-free wheelchair accessible path exists because the only route involves stairs. Please request station assistance at the Information Desk for motorized porter support.'
          };
        }
      }
      return {
        success: false,
        reason: 'unconnected',
        message: 'No walkable connection exists between the selected facilities.'
      };
    }

    // Reconstruct path
    const pathNodes = [];
    const pathEdges = [];
    let curr = destinationId;

    while (curr !== null) {
      pathNodes.unshift(curr);
      const prevInfo = previous[curr];
      if (prevInfo) {
        pathEdges.unshift(prevInfo.edge);
        curr = prevInfo.from;
      } else {
        curr = null;
      }
    }

    // Dynamic Step-by-Step Directions
    const directions = [];
    const startNode = getNodeById(startId);
    const destNode = getNodeById(destinationId);

    directions.push({
      step: 1,
      type: 'start',
      instruction: `Start at ${startNode.name} (${startNode.level}).`,
      detail: startNode.accessibility.notes || 'Proceed along the designated walkway.',
      icon: 'start'
    });

    for (let i = 0; i < pathEdges.length; i++) {
      const edge = pathEdges[i];
      const targetNode = getNodeById(pathNodes[i + 1]);

      let iconType = 'walk';
      if (edge.isLift) iconType = 'lift';
      else if (edge.isRamp) iconType = 'ramp';
      else if (edge.hasStairs) iconType = 'stairs';
      else if (targetNode.category === 'platforms') iconType = 'train';

      directions.push({
        step: i + 2,
        type: iconType,
        instruction: edge.desc,
        detail: `Continue for approximately ${edge.distance} meters towards ${targetNode.name}.`,
        distance: edge.distance,
        icon: iconType
      });
    }

    directions.push({
      step: directions.length + 1,
      type: 'arrival',
      instruction: `Arrive at your destination: ${destNode.name} (${destNode.level}).`,
      detail: destNode.description,
      icon: 'arrival'
    });

    const totalDistance = distances[destinationId];
    const walkingSpeed = wheelchairOnly ? 0.9 : 1.2;
    const estimatedMinutes = Math.max(1, Math.round(totalDistance / (walkingSpeed * 60)));
    const estimatedSteps = Math.round(totalDistance / 0.75);

    return {
      success: true,
      startNode,
      destNode,
      pathNodes,
      pathEdges,
      totalDistance,
      estimatedMinutes,
      estimatedSteps,
      isAccessible: wheelchairOnly,
      directions
    };
  }

  function getNodeById(id) {
    return stationNodes.find(n => n.id === id) || null;
  }

  /* ==========================================================================
     3. APPLICATION STATE
     ========================================================================== */

  const state = {
    selectedStartId: 'main_entrance',
    selectedDestId: 'platform_3',
    accessibilityMode: false,
    activeRoute: null,
    activeFacility: null,
    searchFilterCategory: 'all',
    searchQuery: '',
    mapZoom: 1,
    mapPan: { x: 0, y: 0 },
    isPanning: false,
    panStart: { x: 0, y: 0 },
    speechSynthesisUtterance: null,
    isSpeaking: false
  };

  /* ==========================================================================
     4. RAW SVG PATH DATA REPOSITORY (Clean & Direct)
     ========================================================================== */

  const iconPaths = {
    door: 'M19 19V5c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v14H3v2h18v-2h-2zm-4-6h-2v-2h2v2z',
    ticket: 'M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-9 7.5h-2v-2h2v2zm0-4.5h-2v-2h2v2zm0-4.5h-2v-2h2v2z',
    train: 'M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zm0 2c3.51 0 4.96.48 5.57 1H6.43c.61-.52 2.06-1 5.57-1zM6 7h12v3H6V7zm1.5 10c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
    waiting: 'M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
    aid: 'M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z',
    info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
    luggage: 'M17 6h-2V3c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v3H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2 0 .55.45 1 1 1s1-.45 1-1h6c0 .55.45 1 1 1s1-.45 1-1c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM11 4h2v2h-2V4zm6 15H7V8h10v11z',
    food: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z',
    restroom: 'M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z',
    wheelchair: 'M12 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7.66 12.63l-2.12-4.24C17.18 11.66 16.42 11 15.5 11H13V6c0-.55-.45-1-1-1s-1 .45-1 1v7c0 .55.45 1 1 1h3.36l1.6 3.2c-.79.5-1.74.8-2.76.8-2.76 0-5-2.24-5-5 0-1.42.59-2.71 1.54-3.62l-1.41-1.42C7.94 9.35 7.15 11.08 7.15 13c0 3.87 3.13 7 7 7 1.62 0 3.1-.55 4.29-1.48l2.09 2.09 1.41-1.41-2.28-2.57z',
    lift: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-6 15h-2v-3h2v3zm0-5h-2V7h2v6zm-5 5H6v-3h2v3zm0-5H6V7h2v6zm10 5h-2v-3h2v3zm0-5h-2V7h2v6z',
    ramp: 'M19 17h-2.5l-4.5-9-4 8H3v2h18v-1zm-9.5-7.5l3.2 6.5H8.3l2.2-6.5z',
    stairs: 'M19 3H16v4h-3v4h-3v4H7v4H4v2h5v-4h3v-4h3v-4h3V5h2V3h-1z',
    bridge: 'M20 13V8h-2v3H6V8H4v5H2v3h2v4h2v-4h12v4h2v-4h2v-3h-2zM6 13h12v1H6v-1z',
    junction: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
    walk: 'M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7z',
    start: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    arrival: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'
  };

  /**
   * Helper function to generate clean HTML icon strings with strictly bounded dimensions
   */
  function getHtmlIcon(type, size = 18) {
    const d = iconPaths[type] || iconPaths.junction;
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" style="max-width:${size}px;max-height:${size}px;display:inline-block;vertical-align:middle;flex-shrink:0;" fill="currentColor" aria-hidden="true"><path d="${d}"/></svg>`;
  }

  /* ==========================================================================
     5. DOM ELEMENTS CACHE
     ========================================================================== */

  const el = {};

  function initElements() {
    el.accToggleHeader = document.getElementById('accToggleHeader');
    el.accCheckboxHeader = document.getElementById('accCheckboxHeader');
    el.accBannerToggle = document.getElementById('accBannerToggle');
    el.btnToggleAccHero = document.getElementById('btnToggleAccHero');

    el.tabBtnRoute = document.getElementById('tabBtnRoute');
    el.tabBtnSearch = document.getElementById('tabBtnSearch');
    el.paneRoute = document.getElementById('paneRoute');
    el.paneSearch = document.getElementById('paneSearch');

    el.selectStart = document.getElementById('selectStart');
    el.selectDest = document.getElementById('selectDest');
    el.btnSwap = document.getElementById('btnSwap');
    el.btnFindRoute = document.getElementById('btnFindRoute');
    el.btnClearRoute = document.getElementById('btnClearRoute');

    el.routeResultsContainer = document.getElementById('routeResultsContainer');
    el.routeSummaryCard = document.getElementById('routeSummaryCard');
    el.routeTypeBadge = document.getElementById('routeTypeBadge');
    el.routeDistance = document.getElementById('routeDistance');
    el.routeTime = document.getElementById('routeTime');
    el.routeStepsCount = document.getElementById('routeStepsCount');
    el.directionsStepsWrap = document.getElementById('directionsStepsWrap');
    el.btnAudioDirections = document.getElementById('btnAudioDirections');

    el.inputFacilitySearch = document.getElementById('inputFacilitySearch');
    el.btnClearSearch = document.getElementById('btnClearSearch');
    el.categoryPills = document.querySelectorAll('.category-pill');
    el.searchResultsList = document.getElementById('searchResultsList');

    el.mapSvg = document.getElementById('stationMapSvg');
    el.mapCanvas = document.getElementById('mapCanvasViewport');
    el.mapNodesGroup = document.getElementById('mapNodesGroup');
    el.mapPathsGroup = document.getElementById('mapPathsGroup');
    el.activeRoutePath = document.getElementById('activeRoutePath');
    el.btnZoomIn = document.getElementById('btnZoomIn');
    el.btnZoomOut = document.getElementById('btnZoomOut');
    el.btnResetMap = document.getElementById('btnResetMap');
    el.mapStatusPill = document.getElementById('mapStatusPill');

    el.facilityModal = document.getElementById('facilityModal');
    el.btnCloseModal = document.getElementById('btnCloseModal');
    el.modalTitle = document.getElementById('modalTitle');
    el.modalCategory = document.getElementById('modalCategory');
    el.modalDescription = document.getElementById('modalDescription');
    el.modalLocation = document.getElementById('modalLocation');
    el.modalAccessibility = document.getElementById('modalAccessibility');
    el.modalSpecialNotes = document.getElementById('modalSpecialNotes');
    el.modalConnections = document.getElementById('modalConnections');
    el.btnModalSetStart = document.getElementById('btnModalSetStart');
    el.btnModalSetDest = document.getElementById('btnModalSetDest');

    el.toast = document.getElementById('toastNotification');
    el.toastMessage = document.getElementById('toastMessage');

    el.btnStartNavHero = document.getElementById('btnStartNavHero');
    el.btnFindFacilitiesHero = document.getElementById('btnFindFacilitiesHero');
    el.btnToggleContrast = document.getElementById('btnToggleContrast');
    el.btnToggleTextSize = document.getElementById('btnToggleTextSize');
  }

  /* ==========================================================================
     6. INITIALIZATION & UI POPULATION
     ========================================================================== */

  function init() {
    initElements();
    populateSelectDropdowns();
    renderSvgMapBase();
    renderFacilitySearchResults();
    bindEventListeners();

    // Default route initialization
    calculateAndDisplayRoute();
  }

  function populateSelectDropdowns() {
    const sortedNodes = [...stationNodes].sort((a, b) => a.name.localeCompare(b.name));

    el.selectStart.innerHTML = '';
    el.selectDest.innerHTML = '';

    sortedNodes.forEach(node => {
      const opt1 = document.createElement('option');
      opt1.value = node.id;
      opt1.textContent = `${node.name} (${node.level})`;
      el.selectStart.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = node.id;
      opt2.textContent = `${node.name} (${node.level})`;
      el.selectDest.appendChild(opt2);
    });

    el.selectStart.value = state.selectedStartId;
    el.selectDest.value = state.selectedDestId;
  }

  /* ==========================================================================
     7. SVG MAP RENDERING & CONTROLS
     ========================================================================== */

  /**
   * Generates interactive nodes and walkable path vectors inside the SVG map.
   * FIX: Uses direct SVG <path> elements with explicit transforms instead of nested <svg> tags!
   */
  function renderSvgMapBase() {
    // 1. Render all walkable connection lines
    el.mapPathsGroup.innerHTML = '';
    const renderedEdges = new Set();

    stationEdges.forEach(edge => {
      const key = [edge.from, edge.to].sort().join('--');
      if (renderedEdges.has(key)) return;
      renderedEdges.add(key);

      const fromNode = getNodeById(edge.from);
      const toNode = getNodeById(edge.to);
      if (!fromNode || !toNode) return;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', fromNode.x);
      line.setAttribute('y1', fromNode.y);
      line.setAttribute('x2', toNode.x);
      line.setAttribute('y2', toNode.y);
      line.setAttribute('class', 'svg-walk-path');
      line.setAttribute('data-connection', key);
      el.mapPathsGroup.appendChild(line);
    });

    // 2. Render all facility nodes & markers
    el.mapNodesGroup.innerHTML = '';

    stationNodes.forEach(node => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', `svg-map-node ${node.category}`);
      g.setAttribute('id', `node-marker-${node.id}`);
      g.setAttribute('transform', `translate(${node.x}, ${node.y})`);
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', `${node.name}, ${node.level}`);

      // Node circle base
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('class', 'node-base');
      circle.setAttribute('r', '16');

      // Native SVG path icon (NOT nested <svg>)
      const pathD = iconPaths[node.iconType] || iconPaths.junction;
      const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      iconPath.setAttribute('d', pathD);
      iconPath.setAttribute('fill', '#ffffff');
      iconPath.setAttribute('transform', 'translate(-7.5, -7.5) scale(0.625)');
      iconPath.setAttribute('pointer-events', 'none');

      // Node label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('class', 'svg-node-label');
      text.setAttribute('y', '27');
      text.textContent = node.mapLabel || node.name;

      // Sublabel
      const subtext = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      subtext.setAttribute('class', 'svg-node-sublabel');
      subtext.setAttribute('y', '38');
      subtext.textContent = node.mapSublabel || node.level;

      g.appendChild(circle);
      g.appendChild(iconPath);
      g.appendChild(text);
      g.appendChild(subtext);

      // Node Click Handler -> Open Detail Modal
      g.addEventListener('click', (e) => {
        e.stopPropagation();
        openFacilityDetails(node.id);
      });

      // Keyboard accessible Enter/Space trigger
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openFacilityDetails(node.id);
        }
      });

      el.mapNodesGroup.appendChild(g);
    });
  }

  function updateMapHighlights() {
    const nodes = el.mapNodesGroup.querySelectorAll('.svg-map-node');
    nodes.forEach(n => {
      n.classList.remove('selected', 'start-pin', 'end-pin');
    });

    if (state.activeFacility) {
      const selectedEl = document.getElementById(`node-marker-${state.activeFacility}`);
      if (selectedEl) selectedEl.classList.add('selected');
    }

    if (state.selectedStartId) {
      const startEl = document.getElementById(`node-marker-${state.selectedStartId}`);
      if (startEl) startEl.classList.add('start-pin');
    }

    if (state.selectedDestId) {
      const destEl = document.getElementById(`node-marker-${state.selectedDestId}`);
      if (destEl) destEl.classList.add('end-pin');
    }
  }

  function drawRoutePath(pathNodes) {
    if (!pathNodes || pathNodes.length < 2) {
      el.activeRoutePath.setAttribute('d', '');
      return;
    }

    const points = pathNodes.map(id => {
      const n = getNodeById(id);
      return `${n.x},${n.y}`;
    });

    const d = `M ${points.join(' L ')}`;
    el.activeRoutePath.setAttribute('d', d);

    if (state.accessibilityMode) {
      el.activeRoutePath.setAttribute('class', 'svg-route-path accessible');
    } else {
      el.activeRoutePath.setAttribute('class', 'svg-route-path standard');
    }
  }

  function applyMapTransform() {
    const svgInner = document.getElementById('svgViewportGroup');
    if (svgInner) {
      svgInner.setAttribute('transform', `translate(${state.mapPan.x}, ${state.mapPan.y}) scale(${state.mapZoom})`);
    }
  }

  function zoomMap(delta) {
    const newZoom = Math.min(2.5, Math.max(0.7, state.mapZoom + delta));
    state.mapZoom = Number(newZoom.toFixed(2));
    applyMapTransform();
  }

  function resetMapView() {
    state.mapZoom = 1;
    state.mapPan = { x: 0, y: 0 };
    applyMapTransform();
  }

  /* ==========================================================================
     8. ROUTE NAVIGATION EXECUTION & DIRECTIONS
     ========================================================================== */

  function calculateAndDisplayRoute() {
    const startId = el.selectStart.value;
    const destId = el.selectDest.value;

    state.selectedStartId = startId;
    state.selectedDestId = destId;

    const result = findShortestRoute(startId, destId, state.accessibilityMode);

    if (!result.success) {
      state.activeRoute = null;
      drawRoutePath([]);
      updateMapHighlights();
      el.routeResultsContainer.classList.remove('visible');
      showToast(result.message, 'warning');
      el.mapStatusPill.textContent = 'Route Unavailable';
      el.mapStatusPill.style.color = '#ef4444';
      return;
    }

    state.activeRoute = result;
    drawRoutePath(result.pathNodes);
    updateMapHighlights();

    // Populate Summary Card
    el.routeResultsContainer.classList.add('visible');
    el.routeDistance.textContent = `${result.totalDistance} m`;
    el.routeTime.textContent = `~${result.estimatedMinutes} min`;
    el.routeStepsCount.textContent = `${result.estimatedSteps}`;

    if (state.accessibilityMode) {
      el.routeSummaryCard.classList.add('accessible');
      el.routeTypeBadge.className = 'route-type-badge accessible';
      el.routeTypeBadge.innerHTML = `${getHtmlIcon('wheelchair', 14)} Wheelchair Accessible (Step-Free)`;
      el.mapStatusPill.textContent = 'Accessible Route Active';
      el.mapStatusPill.style.color = '#10b981';
    } else {
      el.routeSummaryCard.classList.remove('accessible');
      el.routeTypeBadge.className = 'route-type-badge standard';
      el.routeTypeBadge.innerHTML = `Standard Walking Route`;
      el.mapStatusPill.textContent = 'Active Route';
      el.mapStatusPill.style.color = '#38bdf8';
    }

    // Render Step-by-Step Directions
    el.directionsStepsWrap.innerHTML = '';
    result.directions.forEach(step => {
      const stepEl = document.createElement('div');
      stepEl.className = 'step-card';

      const iconSvg = getHtmlIcon(step.icon, 16);

      stepEl.innerHTML = `
        <div class="step-number-badge">${step.step}</div>
        <div class="step-icon">${iconSvg}</div>
        <div class="step-info">
          <div class="step-instruction">${step.instruction}</div>
          <div class="step-detail">${step.detail}</div>
        </div>
      `;
      el.directionsStepsWrap.appendChild(stepEl);
    });

    showToast(`Route found: ${result.totalDistance}m (${result.estimatedMinutes} min walk)`, 'success');
  }

  function clearActiveRoute() {
    state.activeRoute = null;
    drawRoutePath([]);
    el.routeResultsContainer.classList.remove('visible');
    updateMapHighlights();
    el.mapStatusPill.textContent = 'Ready';
    el.mapStatusPill.style.color = '#38bdf8';
    stopSpeaking();
    showToast('Active route cleared', 'success');
  }

  function swapStartAndDestination() {
    const temp = el.selectStart.value;
    el.selectStart.value = el.selectDest.value;
    el.selectDest.value = temp;

    state.selectedStartId = el.selectStart.value;
    state.selectedDestId = el.selectDest.value;

    calculateAndDisplayRoute();
  }

  /* ==========================================================================
     9. ACCESSIBILITY MODE CONTROLLER
     ========================================================================== */

  function toggleAccessibilityMode(enabled) {
    state.accessibilityMode = enabled;

    el.accCheckboxHeader.checked = enabled;
    if (el.accToggleHeader) {
      el.accToggleHeader.classList.toggle('active', enabled);
    }

    if (el.accBannerToggle) {
      el.accBannerToggle.classList.toggle('disabled', !enabled);
    }

    if (enabled) {
      showToast('Accessibility Mode ON: Routing via ramps and elevators only. Stairs excluded.', 'success');
    } else {
      showToast('Accessibility Mode OFF: Standard routing active.', 'info');
    }

    calculateAndDisplayRoute();
  }

  /* ==========================================================================
     10. FACILITY SEARCH & DIRECTORY
     ========================================================================== */

  function renderFacilitySearchResults() {
    const query = state.searchQuery.toLowerCase().trim();
    const category = state.searchFilterCategory;

    const filtered = stationNodes.filter(node => {
      const matchCat = category === 'all' || node.category === category;
      const matchQuery = !query ||
        node.name.toLowerCase().includes(query) ||
        node.description.toLowerCase().includes(query) ||
        node.level.toLowerCase().includes(query) ||
        node.categoryLabel.toLowerCase().includes(query);

      return matchCat && matchQuery;
    });

    el.searchResultsList.innerHTML = '';

    if (filtered.length === 0) {
      el.searchResultsList.innerHTML = `
        <div class="no-results-msg">
          ${getHtmlIcon('info', 32)}
          <p>No station facilities found matching "<strong>${state.searchQuery}</strong>".</p>
          <button class="btn-card-action" style="margin-top:0.5rem;" id="btnResetSearchFilter">Reset Filters</button>
        </div>
      `;

      const resetBtn = document.getElementById('btnResetSearchFilter');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.searchQuery = '';
          el.inputFacilitySearch.value = '';
          el.btnClearSearch.style.display = 'none';
          setCategoryFilter('all');
        });
      }
      return;
    }

    filtered.forEach(node => {
      const card = document.createElement('div');
      card.className = `facility-card ${state.activeFacility === node.id ? 'active-selected' : ''}`;
      card.setAttribute('data-id', node.id);

      const accBadge = node.accessibility.isWheelchairAccessible
        ? `<span class="facility-accessible-badge">${getHtmlIcon('wheelchair', 12)} Accessible</span>`
        : `<span style="color:#f87171;font-size:0.75rem;">Stairs Only</span>`;

      card.innerHTML = `
        <div class="facility-card-left">
          <div class="facility-type-icon">${getHtmlIcon(node.iconType, 20)}</div>
          <div class="facility-title-wrap">
            <h4>${node.name}</h4>
            <div class="facility-meta">
              <span class="facility-category-tag">${node.level}</span>
              <span>•</span>
              ${accBadge}
            </div>
          </div>
        </div>
        <div class="facility-card-actions">
          <button class="btn-card-action btn-view-map" title="View details and location on map">Details</button>
          <button class="btn-card-action btn-route-to" title="Navigate here">Directions</button>
        </div>
      `;

      card.querySelector('.btn-view-map').addEventListener('click', (e) => {
        e.stopPropagation();
        openFacilityDetails(node.id);
      });

      card.querySelector('.btn-route-to').addEventListener('click', (e) => {
        e.stopPropagation();
        el.selectDest.value = node.id;
        state.selectedDestId = node.id;
        activateTab('route');
        calculateAndDisplayRoute();
      });

      card.addEventListener('click', () => {
        openFacilityDetails(node.id);
      });

      el.searchResultsList.appendChild(card);
    });
  }

  function setCategoryFilter(category) {
    state.searchFilterCategory = category;
    el.categoryPills.forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-category') === category);
    });
    renderFacilitySearchResults();
  }

  /* ==========================================================================
     11. FACILITY INFORMATION MODAL / DRAWER
     ========================================================================== */

  function openFacilityDetails(nodeId) {
    const node = getNodeById(nodeId);
    if (!node) return;

    state.activeFacility = nodeId;
    updateMapHighlights();

    el.modalTitle.textContent = node.name;
    el.modalCategory.textContent = `${node.categoryLabel} • ${node.level}`;
    el.modalDescription.textContent = node.description;
    el.modalLocation.textContent = `${node.level} (Coordinates: X ${node.x}, Y ${node.y})`;

    const acc = node.accessibility;
    el.modalAccessibility.innerHTML = acc.isWheelchairAccessible
      ? `<span style="color:#10b981;display:flex;align-items:center;gap:4px;">${getHtmlIcon('wheelchair', 14)} Wheelchair Accessible</span>`
      : `<span style="color:#ef4444;">Standard / Stairs Required</span>`;

    el.modalSpecialNotes.textContent = acc.notes || 'Standard station facility guidelines apply.';

    const neighbors = (graph[node.id] || []).map(edge => {
      const neighborNode = getNodeById(edge.to);
      return `${neighborNode.name} (${edge.distance}m)`;
    });
    el.modalConnections.textContent = neighbors.join(', ') || 'Direct destination';

    el.facilityModal.classList.add('open');
    el.facilityModal.setAttribute('aria-hidden', 'false');

    centerMapOnNode(node);
  }

  function closeFacilityDetails() {
    el.facilityModal.classList.remove('open');
    el.facilityModal.setAttribute('aria-hidden', 'true');
    state.activeFacility = null;
    updateMapHighlights();
  }

  function centerMapOnNode(node) {
    state.mapPan.x = (500 - node.x) * 0.5;
    state.mapPan.y = (325 - node.y) * 0.5;
    applyMapTransform();
  }

  /* ==========================================================================
     12. AUDIO DIRECTIONS (TEXT-TO-SPEECH)
     ========================================================================== */

  function speakDirections() {
    if (!window.speechSynthesis) {
      showToast('Text-to-speech is not supported by this browser.', 'warning');
      return;
    }

    if (state.isSpeaking) {
      stopSpeaking();
      return;
    }

    if (!state.activeRoute || !state.activeRoute.directions) {
      showToast('Please calculate a route first before starting voice guidance.', 'warning');
      return;
    }

    const narrationText = state.activeRoute.directions.map(d => `${d.instruction} ${d.detail}`).join('. ');

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      state.isSpeaking = true;
      el.btnAudioDirections.classList.add('speaking');
      el.btnAudioDirections.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 6h12v12H6z"/></svg> Stop Voice Guidance`;
    };

    utterance.onend = () => {
      stopSpeaking();
    };

    utterance.onerror = () => {
      stopSpeaking();
    };

    state.speechSynthesisUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    showToast('Voice navigation started.', 'info');
  }

  function stopSpeaking() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    state.isSpeaking = false;
    if (el.btnAudioDirections) {
      el.btnAudioDirections.classList.remove('speaking');
      el.btnAudioDirections.innerHTML = `${getHtmlIcon('walk', 15)} Listen to Directions`;
    }
  }

  /* ==========================================================================
     13. TOAST NOTIFICATIONS & TABS
     ========================================================================== */

  let toastTimeout = null;
  function showToast(message, type = 'info') {
    if (!el.toast) return;

    clearTimeout(toastTimeout);
    el.toastMessage.textContent = message;
    el.toast.className = `toast-notification show ${type}`;

    toastTimeout = setTimeout(() => {
      el.toast.classList.remove('show');
    }, 4000);
  }

  function activateTab(tabName) {
    if (tabName === 'route') {
      el.tabBtnRoute.classList.add('active');
      el.tabBtnSearch.classList.remove('active');
      el.paneRoute.classList.add('active');
      el.paneSearch.classList.remove('active');
    } else {
      el.tabBtnSearch.classList.add('active');
      el.tabBtnRoute.classList.remove('active');
      el.paneSearch.classList.add('active');
      el.paneRoute.classList.remove('active');
    }
  }

  /* ==========================================================================
     14. EVENT LISTENERS BINDING
     ========================================================================== */

  function bindEventListeners() {
    el.accCheckboxHeader.addEventListener('change', (e) => {
      toggleAccessibilityMode(e.target.checked);
    });

    if (el.btnToggleAccHero) {
      el.btnToggleAccHero.addEventListener('click', () => {
        toggleAccessibilityMode(!state.accessibilityMode);
      });
    }

    el.tabBtnRoute.addEventListener('click', () => activateTab('route'));
    el.tabBtnSearch.addEventListener('click', () => activateTab('search'));

    el.btnFindRoute.addEventListener('click', calculateAndDisplayRoute);
    el.btnClearRoute.addEventListener('click', clearActiveRoute);
    el.btnSwap.addEventListener('click', swapStartAndDestination);

    el.selectStart.addEventListener('change', () => {
      state.selectedStartId = el.selectStart.value;
      updateMapHighlights();
    });

    el.selectDest.addEventListener('change', () => {
      state.selectedDestId = el.selectDest.value;
      updateMapHighlights();
    });

    el.btnAudioDirections.addEventListener('click', speakDirections);

    el.inputFacilitySearch.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      el.btnClearSearch.style.display = state.searchQuery ? 'block' : 'none';
      renderFacilitySearchResults();
    });

    el.btnClearSearch.addEventListener('click', () => {
      state.searchQuery = '';
      el.inputFacilitySearch.value = '';
      el.btnClearSearch.style.display = 'none';
      renderFacilitySearchResults();
      el.inputFacilitySearch.focus();
    });

    el.categoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const cat = pill.getAttribute('data-category');
        setCategoryFilter(cat);
      });
    });

    el.btnZoomIn.addEventListener('click', () => zoomMap(0.2));
    el.btnZoomOut.addEventListener('click', () => zoomMap(-0.2));
    el.btnResetMap.addEventListener('click', resetMapView);

    el.mapCanvas.addEventListener('mousedown', (e) => {
      if (e.target.closest('.svg-map-node')) return;
      state.isPanning = true;
      state.panStart = { x: e.clientX - state.mapPan.x, y: e.clientY - state.mapPan.y };
    });

    window.addEventListener('mousemove', (e) => {
      if (!state.isPanning) return;
      state.mapPan.x = e.clientX - state.panStart.x;
      state.mapPan.y = e.clientY - state.panStart.y;
      applyMapTransform();
    });

    window.addEventListener('mouseup', () => {
      state.isPanning = false;
    });

    el.mapCanvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      zoomMap(delta);
    }, { passive: false });

    el.btnCloseModal.addEventListener('click', closeFacilityDetails);
    el.facilityModal.addEventListener('click', (e) => {
      if (e.target === el.facilityModal) closeFacilityDetails();
    });

    el.btnModalSetStart.addEventListener('click', () => {
      if (!state.activeFacility) return;
      el.selectStart.value = state.activeFacility;
      state.selectedStartId = state.activeFacility;
      closeFacilityDetails();
      activateTab('route');
      calculateAndDisplayRoute();
    });

    el.btnModalSetDest.addEventListener('click', () => {
      if (!state.activeFacility) return;
      el.selectDest.value = state.activeFacility;
      state.selectedDestId = state.activeFacility;
      closeFacilityDetails();
      activateTab('route');
      calculateAndDisplayRoute();
    });

    if (el.btnStartNavHero) {
      el.btnStartNavHero.addEventListener('click', () => {
        activateTab('route');
        document.getElementById('navigationSection').scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (el.btnFindFacilitiesHero) {
      el.btnFindFacilitiesHero.addEventListener('click', () => {
        activateTab('search');
        document.getElementById('navigationSection').scrollIntoView({ behavior: 'smooth' });
        el.inputFacilitySearch.focus();
      });
    }

    if (el.btnToggleContrast) {
      el.btnToggleContrast.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast-mode');
        const isActive = document.body.classList.contains('high-contrast-mode');
        showToast(`High Contrast Mode ${isActive ? 'Enabled' : 'Disabled'}`, 'info');
      });
    }

    if (el.btnToggleTextSize) {
      el.btnToggleTextSize.addEventListener('click', () => {
        document.body.classList.toggle('large-text-mode');
        const isActive = document.body.classList.contains('large-text-mode');
        showToast(`Text Display ${isActive ? 'Enlarged' : 'Normal'}`, 'info');
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && el.facilityModal.classList.contains('open')) {
        closeFacilityDetails();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
